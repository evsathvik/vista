import React, { useState } from 'react';
import { UserCheck, Check, X } from 'lucide-react';
import { useStore } from '../store';

export default function AttendanceCalculator() {
  const { user, updateCourse } = useStore();
  const [requiredPercentage, setRequiredPercentage] = useState(75);

  const calculateRequiredClasses = (attended: number, total: number, required: number) => {
    const currentPercentage = (attended / total) * 100;
    if (currentPercentage >= required) {
      return 0;
    }

    const totalRequired = Math.ceil((required * total) / 100);
    return totalRequired - attended;
  };

  const calculateMissableClasses = (attended: number, total: number, required: number) => {
    const currentAttendance = (attended / total) * 100;
    if (currentAttendance < required) return 0;
    
    const minimumClassesNeeded = Math.ceil((required * total) / 100);
    return attended - minimumClassesNeeded;
  };

  const handleUpdateAttendance = (courseId: string, attended: number, total: number) => {
    if (attended <= total) {
      updateCourse(courseId, {
        attendance: attended,
        totalClasses: total
      });
    }
  };

  const markAttendance = (courseId: string, isPresent: boolean) => {
    const course = user?.courses.find(c => c.id === courseId);
    if (course) {
      const newAttendance = isPresent ? course.attendance + 1 : course.attendance;
      const newTotal = course.totalClasses + 1;
      updateCourse(courseId, {
        attendance: newAttendance,
        totalClasses: newTotal
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserCheck className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold">Attendance Calculator</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Required Attendance Percentage
        </label>
        <input
          type="number"
          value={requiredPercentage}
          onChange={(e) => setRequiredPercentage(Number(e.target.value))}
          className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          min="0"
          max="100"
        />
      </div>

      <div className="space-y-4">
        {user?.courses.map((course) => {
          const requiredClasses = calculateRequiredClasses(
            course.attendance,
            course.totalClasses,
            requiredPercentage
          );
          const missableClasses = calculateMissableClasses(
            course.attendance,
            course.totalClasses,
            requiredPercentage
          );
          const currentPercentage = course.totalClasses > 0
            ? ((course.attendance / course.totalClasses) * 100).toFixed(1)
            : '0.0';

          return (
            <div key={course.id} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{course.name}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Classes Attended
                  </label>
                  <input
                    type="number"
                    value={course.attendance}
                    onChange={(e) => handleUpdateAttendance(
                      course.id,
                      Number(e.target.value),
                      course.totalClasses
                    )}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Classes
                  </label>
                  <input
                    type="number"
                    value={course.totalClasses}
                    onChange={(e) => handleUpdateAttendance(
                      course.id,
                      course.attendance,
                      Number(e.target.value)
                    )}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="mb-4 p-4 bg-white rounded-md">
                <h4 className="font-medium mb-2">Mark Today's Attendance</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => markAttendance(course.id, true)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    <Check size={16} /> Present
                  </button>
                  <button
                    onClick={() => markAttendance(course.id, false)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    <X size={16} /> Absent
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Current Attendance</span>
                    <span className="text-sm font-semibold">{currentPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        Number(currentPercentage) >= requiredPercentage
                          ? 'bg-green-600'
                          : 'bg-yellow-400'
                      }`}
                      style={{ width: `${Math.min(100, Number(currentPercentage))}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Classes Attended:</span> {course.attendance} out of {course.totalClasses}
                  </p>
                  
                  {requiredClasses > 0 ? (
                    <p className="text-sm text-red-600">
                      You need to attend {requiredClasses} more classes to reach {requiredPercentage}% attendance.
                    </p>
                  ) : (
                    <p className="text-sm text-green-600">
                      You have reached the required attendance percentage!
                      {missableClasses > 0 && (
                        <span className="block mt-1">
                          You can miss up to {missableClasses} more classes while maintaining {requiredPercentage}% attendance.
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}