import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

interface TimeSlot {
  time: string;
  course: string;
}

interface DaySchedule {
  day: string;
  slots: TimeSlot[];
}

export default function TimetableGenerator() {
  const { user, updateTimetable } = useStore();
  const [timetable, setTimetable] = useState<DaySchedule[]>([]);
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    // Initialize timetable if it doesn't exist
    if (!user?.timetable || user.timetable.length === 0) {
      const initialTimetable = DAYS.map(day => ({ day, slots: [] }));
      setTimetable(initialTimetable);
      updateTimetable(initialTimetable);
    } else {
      setTimetable(user.timetable);
    }
  }, [user?.timetable, updateTimetable]);

  const handleAddSlot = () => {
    if (!selectedCourse) return;

    // Create a new timetable with the added slot
    const updatedTimetable = timetable.map(daySchedule => {
      if (daySchedule.day === selectedDay) {
        // Check if a slot already exists for this time
        const existingSlotIndex = daySchedule.slots.findIndex(
          slot => slot.time === selectedTime
        );
        
        if (existingSlotIndex >= 0) {
          // Replace the existing slot
          const newSlots = [...daySchedule.slots];
          newSlots[existingSlotIndex] = { time: selectedTime, course: selectedCourse };
          return {
            ...daySchedule,
            slots: newSlots
          };
        } else {
          // Add a new slot and sort by time
          return {
            ...daySchedule,
            slots: [
              ...daySchedule.slots,
              { time: selectedTime, course: selectedCourse }
            ].sort((a, b) => TIME_SLOTS.indexOf(a.time) - TIME_SLOTS.indexOf(b.time))
          };
        }
      }
      return daySchedule;
    });

    setTimetable(updatedTimetable);
    updateTimetable(updatedTimetable);
    setSelectedCourse(''); // Clear the input after adding
  };

  const handleRemoveSlot = (day: string, time: string) => {
    const updatedTimetable = timetable.map(daySchedule => {
      if (daySchedule.day === day) {
        return {
          ...daySchedule,
          slots: daySchedule.slots.filter(slot => slot.time !== time)
        };
      }
      return daySchedule;
    });

    setTimetable(updatedTimetable);
    updateTimetable(updatedTimetable);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold">Timetable Generator</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Day</label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {DAYS.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {TIME_SLOTS.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Course</label>
          <input
            type="text"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter course name"
          />
        </div>
      </div>

      <button
        onClick={handleAddSlot}
        disabled={!selectedCourse}
        className={`inline-flex items-center px-4 py-2 ${
          selectedCourse ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
        } text-white rounded-md`}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Time Slot
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              {DAYS.map(day => (
                <th
                  key={day}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {TIME_SLOTS.map(time => (
              <tr key={time}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {time}
                </td>
                {DAYS.map(day => {
                  const slot = timetable
                    .find(d => d.day === day)
                    ?.slots.find(s => s.time === time);

                  return (
                    <td key={day} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {slot ? (
                        <div className="flex items-center justify-between">
                          <span>{slot.course}</span>
                          <button
                            onClick={() => handleRemoveSlot(day, time)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}