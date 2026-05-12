import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import {
  Calculator,
  Calendar,
  BookOpen,
  Activity,
  Clock,
  Bell,
  UserCheck,
  Brain,
  FileText,
  Book,
} from 'lucide-react';
import GPACalculator from './components/GPACalculator';
import ActivityTracker from './components/ActivityTracker';
import CourseProgress from './components/CourseProgress';
import BMITracker from './components/BMITracker';
import TimetableGenerator from './components/TimetableGenerator';
import ReminderSystem from './components/ReminderSystem';
import AttendanceCalculator from './components/AttendanceCalculator';
import MentalWellness from './components/MentalWellness';
import ProgressReports from './components/ProgressReports';
import DigitalLibrary from './components/DigitalLibrary';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Student Management System</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        <Tabs defaultValue="gpa" className="space-y-4">
          <TabsList className="flex flex-wrap gap-2 bg-white p-1 rounded-lg shadow">
            <TabsTrigger value="gpa" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
              <Calculator size={20} />
              <span>GPA Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
              <Calendar size={20} />
              <span>Activities</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
              <BookOpen size={20} />
              <span>Courses</span>
            </TabsTrigger>
            <TabsTrigger value="bmi" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
              <Activity size={20} />
              <span>BMI Tracker</span>
            </TabsTrigger>
            <TabsTrigger value="timetable" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
              <Clock size={20} />
              <span>Timetable</span>
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
              <Bell size={20} />
              <span>Reminders</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
              <UserCheck size={20} />
              <span>Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="mental" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
              <Brain size={20} />
              <span>Mental Wellness</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
              <FileText size={20} />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
              <Book size={20} />
              <span>Digital Library</span>
            </TabsTrigger>
          </TabsList>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <TabsContent value="gpa">
              <GPACalculator />
            </TabsContent>
            <TabsContent value="activities">
              <ActivityTracker />
            </TabsContent>
            <TabsContent value="courses">
              <CourseProgress />
            </TabsContent>
            <TabsContent value="bmi">
              <BMITracker />
            </TabsContent>
            <TabsContent value="timetable">
              <TimetableGenerator />
            </TabsContent>
            <TabsContent value="reminders">
              <ReminderSystem />
            </TabsContent>
            <TabsContent value="attendance">
              <AttendanceCalculator />
            </TabsContent>
            <TabsContent value="mental">
              <MentalWellness />
            </TabsContent>
            <TabsContent value="reports">
              <ProgressReports />
            </TabsContent>
            <TabsContent value="library">
              <DigitalLibrary />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}

export default App;