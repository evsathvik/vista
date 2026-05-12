import React, { useState, useEffect } from 'react';
import { Brain, Plus } from 'lucide-react';
import { useStore } from '../store';
import { MentalWellnessLog } from '../types';

export default function MentalWellness() {
  const { user, addMentalWellnessLog } = useStore();
  const [logs, setLogs] = useState<MentalWellnessLog[]>([]);
  const [newLog, setNewLog] = useState<Partial<MentalWellnessLog>>({
    stressLevel: 5,
    mood: 'neutral',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user?.mentalWellnessLogs) {
      setLogs(user.mentalWellnessLogs);
    }
  }, [user?.mentalWellnessLogs]);

  const handleSubmit = () => {
    if (newLog.mood && newLog.date) {
      const log = {
        ...newLog,
        id: crypto.randomUUID(),
      } as MentalWellnessLog;
      
      addMentalWellnessLog(log);
      setLogs(prev => [...prev, log]);
      
      setNewLog({
        stressLevel: 5,
        mood: 'neutral',
        notes: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const getMoodEmoji = (mood: string) => {
    const moods: Record<string, string> = {
      'very happy': '😄',
      'happy': '🙂',
      'neutral': '😐',
      'sad': '😔',
      'very sad': '😢',
      'anxious': '😰',
      'stressed': '😫'
    };
    return moods[mood] || '😐';
  };

  const getStressLevelColor = (level: number) => {
    if (level <= 3) return 'bg-green-500';
    if (level <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold">Mental Wellness Tracker</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={newLog.date}
            onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mood</label>
          <select
            value={newLog.mood}
            onChange={(e) => setNewLog({ ...newLog, mood: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="very happy">Very Happy 😄</option>
            <option value="happy">Happy 🙂</option>
            <option value="neutral">Neutral 😐</option>
            <option value="sad">Sad 😔</option>
            <option value="very sad">Very Sad 😢</option>
            <option value="anxious">Anxious 😰</option>
            <option value="stressed">Stressed 😫</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Stress Level (1-10)</label>
        <input
          type="range"
          min="1"
          max="10"
          value={newLog.stressLevel}
          onChange={(e) => setNewLog({ ...newLog, stressLevel: Number(e.target.value) })}
          className="mt-1 block w-full"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>Low Stress</span>
          <span>High Stress</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={newLog.notes || ''}
          onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
          placeholder="How are you feeling today? What's on your mind?"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Entry
      </button>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Entries</h3>
        {logs.length === 0 ? (
          <p className="text-gray-500">No entries yet. Add your first wellness log above.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getMoodEmoji(log.mood)}</span>
                  <span className="font-medium capitalize">{log.mood}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(log.date).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Stress Level</span>
                  <span className="text-sm font-medium">{log.stressLevel}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getStressLevelColor(log.stressLevel)}`}
                    style={{ width: `${(log.stressLevel / 10) * 100}%` }}
                  />
                </div>
              </div>
              {log.notes && <p className="text-sm text-gray-700 mt-2">{log.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}