import React from 'react';
import { FileText, Download } from 'lucide-react';
import { useStore } from '../store';
import { jsPDF } from 'jspdf';

export default function ProgressReports() {
  const { user } = useStore();

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.text('Academic Progress Report', 20, yPos);
    yPos += 20;

    // Student Info
    doc.setFontSize(12);
    if (user) {
      doc.text(`Name: ${user.name}`, 20, yPos);
      yPos += 10;
      doc.text(`Email: ${user.email}`, 20, yPos);
      yPos += 20;
    }

    // Course Progress
    doc.setFontSize(16);
    doc.text('Course Progress', 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    user?.courses.forEach(course => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.text(`${course.name} (${course.credits} credits)`, 20, yPos);
      yPos += 7;
      doc.text(`Grade: ${course.grade || 'Not graded'}`, 30, yPos);
      yPos += 7;
      doc.text(
        `Attendance: ${course.attendance}/${course.totalClasses} (${
          course.totalClasses > 0
            ? ((course.attendance / course.totalClasses) * 100).toFixed(1)
            : 0
        }%)`,
        30,
        yPos
      );
      yPos += 7;
      doc.text(
        `Assignments Completed: ${
          course.assignments.filter(a => a.completed).length
        }/${course.assignments.length}`,
        30,
        yPos
      );
      yPos += 15;
    });

    // Activities
    if (user?.activities.length) {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(16);
      doc.text('Extra-Curricular Activities', 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      user.activities.forEach(activity => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.text(`${activity.name} (${activity.type})`, 20, yPos);
        yPos += 7;
        doc.text(
          `Date: ${new Date(activity.date).toLocaleDateString()}`,
          30,
          yPos
        );
        yPos += 7;
        if (activity.description) {
          doc.text(`Description: ${activity.description}`, 30, yPos);
          yPos += 7;
        }
        yPos += 5;
      });
    }

    // Mental Wellness Summary
    if (user?.mentalWellnessLogs.length) {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(16);
      doc.text('Mental Wellness Summary', 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      const averageStress =
        user.mentalWellnessLogs.reduce((sum, log) => sum + log.stressLevel, 0) /
        user.mentalWellnessLogs.length;
      
      doc.text(
        `Average Stress Level: ${averageStress.toFixed(1)}/10`,
        20,
        yPos
      );
      yPos += 10;
    }

    // Save the PDF
    doc.save('academic-progress-report.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold">Progress Reports</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Generate Progress Report</h3>
        <p className="text-gray-600 mb-6">
          Generate a comprehensive PDF report containing your academic progress,
          including course grades, attendance, activities, and wellness tracking.
        </p>
        <button
          onClick={generatePDF}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Report Preview</h3>
        
        {/* Course Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Course Summary</h4>
          <div className="space-y-2">
            {user?.courses.map(course => (
              <div key={course.id} className="flex justify-between items-center">
                <span>{course.name}</span>
                <span className="text-gray-600">
                  {course.grade || 'Not graded'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Attendance Summary</h4>
          <div className="space-y-2">
            {user?.courses.map(course => (
              <div key={course.id} className="flex justify-between items-center">
                <span>{course.name}</span>
                <span className="text-gray-600">
                  {course.totalClasses > 0
                    ? `${((course.attendance / course.totalClasses) * 100).toFixed(
                        1
                      )}%`
                    : '0%'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activities Summary */}
        {user?.activities.length ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Activities Summary</h4>
            <p className="text-gray-600">
              Total Activities: {user.activities.length}
            </p>
            <div className="mt-2">
              {Object.entries(
                user.activities.reduce((acc, activity) => {
                  acc[activity.type] = (acc[activity.type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([type, count]) => (
                <div
                  key={type}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="capitalize">{type}</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Mental Wellness Summary */}
        {user?.mentalWellnessLogs.length ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Mental Wellness Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Average Stress Level</span>
                <span className="text-gray-600">
                  {(
                    user.mentalWellnessLogs.reduce(
                      (sum, log) => sum + log.stressLevel,
                      0
                    ) / user.mentalWellnessLogs.length
                  ).toFixed(1)}
                  /10
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Entries</span>
                <span className="text-gray-600">
                  {user.mentalWellnessLogs.length}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}