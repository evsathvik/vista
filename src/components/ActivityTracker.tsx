import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useStore } from '../store';
import { Activity } from '../types';

export default function ActivityTracker() {
  const { user, addActivity } = useStore();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    name: '',
    type: 'cultural',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user?.activities) {
      setActivities(user.activities);
    }
  }, [user?.activities]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivity.name && newActivity.type && newActivity.date) {
      const activity = {
        ...newActivity,
        id: crypto.randomUUID(),
      } as Activity;
      
      addActivity(activity);
      setActivities(prev => [...prev, activity]);
      
      setNewActivity({
        name: '',
        type: 'cultural',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold">Activity Tracker</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Activity Name</label>
            <input
              type="text"
              value={newActivity.name}
              onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter activity name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={newActivity.type}
              onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as Activity['type'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="cultural">Cultural</option>
              <option value="club">Club</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={newActivity.date}
            onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={newActivity.description}
            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            placeholder="Enter activity description"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Activities</h3>
        {activities.length === 0 ? (
          <p className="text-gray-500">No activities added yet. Add your first activity above.</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{activity.name}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    {activity.type}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}