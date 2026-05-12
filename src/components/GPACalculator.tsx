import React, { useState } from 'react';
import {
  Calculator,
  Trash2,
  Target,
  BarChart3,
  Award,
  BookOpen,
  PenTool,
  GraduationCap,
  Percent,
  CheckCircle2
} from 'lucide-react';

interface Assessment {
  name: string;
  weightage: number;
  marksObtained?: number;
  totalMarks: number;
}

export default function GPACalculator() {
  const [assessments, setAssessments] = useState<Assessment[]>([
    { name: 'Quiz', weightage: 20, totalMarks: 20 },
    { name: 'Mid Term', weightage: 30, totalMarks: 30 },
    { name: 'Assignments', weightage: 20, totalMarks: 20 },
    { name: 'Final Exam', weightage: 30, totalMarks: 30 }
  ]);

  const [targetPercentage, setTargetPercentage] = useState(60);

  const calculateCurrentPercentage = () => {
    const completedAssessments = assessments.filter(a => a.marksObtained !== undefined);
    if (completedAssessments.length === 0) return 0;

    let totalWeightedPercentage = 0;
    let totalWeightage = 0;

    completedAssessments.forEach(assessment => {
      const percentage = ((assessment.marksObtained || 0) / assessment.totalMarks) * 100;
      totalWeightedPercentage += (percentage * assessment.weightage);
      totalWeightage += assessment.weightage;
    });

    return totalWeightage > 0 ? totalWeightedPercentage / totalWeightage : 0;
  };

  const calculateRequiredMarks = () => {
    const remainingAssessments = assessments.filter(a => a.marksObtained === undefined);
    if (remainingAssessments.length === 0) return null;

    const currentPercentage = calculateCurrentPercentage();
    const completedWeightage = assessments
      .filter(a => a.marksObtained !== undefined)
      .reduce((sum, a) => sum + a.weightage, 0);

    const remainingWeightage = 100 - completedWeightage;
    
    if (remainingWeightage <= 0) return null;

    const requiredPercentageInRemaining = 
      ((targetPercentage * 100) - (currentPercentage * completedWeightage)) / remainingWeightage;

    return remainingAssessments.map(assessment => ({
      ...assessment,
      requiredMarks: Math.ceil((requiredPercentageInRemaining / 100) * assessment.totalMarks)
    }));
  };

  const getAssessmentIcon = (name: string) => {
    switch (name) {
      case 'Quiz':
        return <PenTool className="w-5 h-5 text-lime/70" />;
      case 'Mid Term':
        return <BookOpen className="w-5 h-5 text-lime/70" />;
      case 'Assignments':
        return <CheckCircle2 className="w-5 h-5 text-lime/70" />;
      case 'Final Exam':
        return <GraduationCap className="w-5 h-5 text-lime/70" />;
      default:
        return <Award className="w-5 h-5 text-lime/70" />;
    }
  };

  const currentPercentage = calculateCurrentPercentage();
  const requiredMarks = calculateRequiredMarks();

  return (
    <div className="space-y-8 p-6 animate-fade-in">
      <div className="flex items-center gap-3 bg-forest/10 p-4 rounded-lg backdrop-blur-sm">
        <Calculator className="w-8 h-8 text-lime/70" />
        <h2 className="text-2xl font-bold text-black">Assessment Calculator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 animate-slide-up">
          <div className="input-group">
            <Target className="w-5 h-5" />
            <input
              type="number"
              value={targetPercentage}
              onChange={(e) => setTargetPercentage(Number(e.target.value))}
              className="mt-1 block w-full rounded-lg shadow-sm"
              min="0"
              max="100"
              placeholder=" "
            />
            <span className="floating-label">Target Overall Percentage</span>
          </div>

          <div className="assessment-card">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-lime/70" />
              <h3 className="font-medium text-black">Current Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-black">
                <span>Current Overall:</span>
                <span className="text-xl font-semibold">
                  {currentPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-bar-fill ${
                    currentPercentage >= targetPercentage ? 'bg-lime/40' : 'bg-emerald/40'
                  }`}
                  style={{ width: `${Math.min(100, currentPercentage)}%` }}
                />
              </div>
            </div>
          </div>

          {requiredMarks && requiredMarks.length > 0 && (
            <div className="assessment-card">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-lime/70" />
                <h3 className="font-medium text-black">Required Marks</h3>
              </div>
              <div className="space-y-4">
                {requiredMarks.map(assessment => (
                  <div key={assessment.name} className="flex items-center justify-between text-black">
                    <div className="flex items-center gap-2">
                      {getAssessmentIcon(assessment.name)}
                      <span>{assessment.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">
                        {assessment.requiredMarks}
                      </span>
                      <span className="text-gray-600">/ {assessment.totalMarks}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="assessment-card">
            <div className="flex items-center gap-2 mb-4">
              <Percent className="w-5 h-5 text-lime/70" />
              <h3 className="font-medium text-black">Assessment Weightages</h3>
            </div>
            <div className="space-y-3">
              {assessments.map(assessment => (
                <div key={assessment.name} className="flex items-center justify-between text-black">
                  <div className="flex items-center gap-2">
                    {getAssessmentIcon(assessment.name)}
                    <span>{assessment.name}</span>
                  </div>
                  <span>{assessment.weightage}% ({assessment.totalMarks} marks)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-medium flex items-center gap-2 text-black">
              <Award className="w-5 h-5 text-lime/70" />
              <span>Assessments</span>
            </h3>
          </div>

          <div className="space-y-6">
            {assessments.map((assessment, index) => (
              <div key={index} className="assessment-card">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    {getAssessmentIcon(assessment.name)}
                    <span className="text-lg font-medium text-black">{assessment.name}</span>
                  </div>
                  {assessment.name !== 'Quiz' && 
                   assessment.name !== 'Mid Term' && 
                   assessment.name !== 'Assignments' && 
                   assessment.name !== 'Final Exam' && (
                    <button className="text-red-400/70 hover:text-red-500/70">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group">
                      <Percent className="w-4 h-4" />
                      <input
                        type="number"
                        value={assessment.weightage}
                        disabled={assessment.name === 'Quiz' || 
                                assessment.name === 'Mid Term' || 
                                assessment.name === 'Assignments' || 
                                assessment.name === 'Final Exam'}
                        className="disabled:opacity-50"
                        min="0"
                        max="100"
                        placeholder=" "
                      />
                      <span className="floating-label">Weightage (%)</span>
                    </div>
                    <div className="input-group">
                      <Award className="w-4 h-4" />
                      <input
                        type="number"
                        value={assessment.totalMarks}
                        disabled={assessment.name === 'Quiz' || 
                                assessment.name === 'Mid Term' || 
                                assessment.name === 'Assignments' || 
                                assessment.name === 'Final Exam'}
                        className="disabled:opacity-50"
                        min="0"
                        placeholder=" "
                      />
                      <span className="floating-label">Total Marks</span>
                    </div>
                  </div>

                  <div className="input-group">
                    <CheckCircle2 className="w-4 h-4" />
                    <input
                      type="number"
                      value={assessment.marksObtained || ''}
                      onChange={(e) => {
                        const newAssessments = [...assessments];
                        newAssessments[index] = {
                          ...assessment,
                          marksObtained: e.target.value ? Number(e.target.value) : undefined
                        };
                        setAssessments(newAssessments);
                      }}
                      min="0"
                      max={assessment.totalMarks}
                      placeholder=" "
                    />
                    <span className="floating-label">Marks Obtained</span>
                  </div>
                </div>

                {assessment.marksObtained !== undefined && (
                  <div className="mt-6 p-4 bg-forest/10 rounded-lg">
                    <div className="flex justify-between items-center mb-2 text-black">
                      <span>Score:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          {assessment.marksObtained}
                        </span>
                        <span className="text-gray-600">/ {assessment.totalMarks}</span>
                        <span className="text-gray-600">
                          ({((assessment.marksObtained / assessment.totalMarks) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill bg-lime/40"
                        style={{ width: `${(assessment.marksObtained / assessment.totalMarks) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}