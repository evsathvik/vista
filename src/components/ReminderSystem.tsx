import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store';

interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'assignment' | 'exam' | 'other';
}

export default function ReminderSystem() {
  const { user } = useStore();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    type: 'assignment'
  });

  useEffect(() => {
    // Check for due assignments and create reminders
    const assignmentReminders = user?.courses.flatMap(course =>
      course.assignments.map(assignment => ({
        id: assignment.id,
        title: `${course.name}: ${assignment.title}`,
        date: assignment.dueDate,
        time: '23:59',
        type: 'assignment' as const
      }))
    ) || [];

    setReminders(prev => {
      const existingIds = new Set(prev.map(r => r.id));
      const newReminders = assignmentReminders.filter(r => !existingIds.has(r.id));
      return [...prev, ...newReminders];
    });
  }, [user?.courses]);

  const handleAddReminder = () => {
    if (newReminder.title && newReminder.date && newReminder.time) {
      setReminders(prev => [
        ...prev,
        {
          ...newReminder,
          id: crypto.randomUUID()
        } as Reminder
      ]);
      setNewReminder({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        type: 'assignment'
      });
    }
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold">Reminder System</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={newReminder.title}
            onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter reminder title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={newReminder.type}
            onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as Reminder['type'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="assignment">Assignment</option>
            <option value="exam">Exam</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={newReminder.date}
            onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            value={newReminder.time}
            onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        onClick={handleAddReminder}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Reminder
      </button>

      <div className="space-y-4">
        {sortedReminders.map((reminder) => (
          <div
            key={reminder.id}
            className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
          >
            <div>
              <h3 className="font-medium">{reminder.title}</h3>
              <p className="text-sm text-gray-600">
                {new Date(`${reminder.date}T${reminder.time}`).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                {reminder.type}
              </span>
              <button
                onClick={() => handleDeleteReminder(reminder.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}