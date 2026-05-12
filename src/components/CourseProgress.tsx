import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Check, X } from 'lucide-react';
import { useStore } from '../store';
import { Course, Assignment } from '../types';

export default function CourseProgress() {
  const { user, addCourse, updateCourse } = useStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: '',
    credits: 3,
    attendance: 0,
    totalClasses: 0,
    assignments: []
  });

  useEffect(() => {
    if (user?.courses) {
      setCourses(user.courses);
    }
  }, [user?.courses]);

  const handleAddCourse = () => {
    if (newCourse.name) {
      const course = {
        ...newCourse,
        id: crypto.randomUUID(),
        assignments: []
      } as Course;
      
      addCourse(course);
      setCourses(prev => [...prev, course]);
      
      setNewCourse({
        name: '',
        credits: 3,
        attendance: 0,
        totalClasses: 0,
        assignments: []
      });
    }
  };

  const handleAddAssignment = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const newAssignment: Assignment = {
        id: crypto.randomUUID(),
        title: 'New Assignment',
        dueDate: new Date().toISOString().split('T')[0],
        completed: false
      };
      
      const updatedAssignments = [...course.assignments, newAssignment];
      updateCourse(courseId, {
        assignments: updatedAssignments
      });
      
      // Update local state
      setCourses(prev => 
        prev.map(c => 
          c.id === courseId 
            ? { ...c, assignments: updatedAssignments } 
            : c
        )
      );
    }
  };

  const toggleAssignment = (courseId: string, assignmentId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const updatedAssignments = course.assignments.map(a =>
        a.id === assignmentId ? { ...a, completed: !a.completed } : a
      );
      
      updateCourse(courseId, { assignments: updatedAssignments });
      
      // Update local state
      setCourses(prev => 
        prev.map(c => 
          c.id === courseId 
            ? { ...c, assignments: updatedAssignments } 
            : c
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold">Course Progress</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Name</label>
          <input
            type="text"
            value={newCourse.name}
            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter course name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Credits</label>
          <input
            type="number"
            value={newCourse.credits}
            onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        onClick={handleAddCourse}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Course
      </button>

      <div className="space-y-6">
        {courses.length === 0 ? (
          <p className="text-gray-500">No courses added yet. Add your first course above.</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{course.name}</h3>
                  <p className="text-sm text-gray-600">{course.credits} credits</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Attendance: {course.attendance}/{course.totalClasses}
                  </p>
                  <p className="text-sm text-gray-600">
                    {course.grade ? `Grade: ${course.grade}` : 'No grade yet'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Assignments</h4>
                  <button
                    onClick={() => handleAddAssignment(course.id)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {course.assignments.length === 0 ? (
                  <p className="text-sm text-gray-500">No assignments yet. Add your first assignment.</p>
                ) : (
                  course.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-2 bg-white rounded-md"
                    >
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleAssignment(course.id, assignment.id)}
                          className={`p-1 rounded-full mr-2 ${
                            assignment.completed
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {assignment.completed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                        <span className={assignment.completed ? 'line-through text-gray-400' : ''}>
                          {assignment.title}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}