import { create } from 'zustand';
import { User, Course, Activity, MentalWellnessLog, Note } from './types';

interface State {
  user: User | null;
  setUser: (user: User) => void;
  addCourse: (course: Course) => void;
  updateCourse: (courseId: string, course: Partial<Course>) => void;
  addActivity: (activity: Activity) => void;
  addMentalWellnessLog: (log: MentalWellnessLog) => void;
  updateBMI: (bmiData: { weight: number; height: number; date: string; bmi: number }) => void;
  updateTimetable: (timetable: User['timetable']) => void;
  addNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
}

// Initialize with default user data
const defaultUser: User = {
  id: '1',
  name: 'Student',
  email: 'student@example.com',
  courses: [],
  activities: [],
  mentalWellnessLogs: [],
  notes: [],
  bmiHistory: [],
  timetable: [
    { day: 'Monday', slots: [] },
    { day: 'Tuesday', slots: [] },
    { day: 'Wednesday', slots: [] },
    { day: 'Thursday', slots: [] },
    { day: 'Friday', slots: [] },
  ]
};

export const useStore = create<State>((set) => ({
  user: defaultUser,
  setUser: (user) => set({ user }),
  addCourse: (course) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, courses: [...state.user.courses, course] }
        : null,
    })),
  updateCourse: (courseId, courseUpdate) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            courses: state.user.courses.map((c) =>
              c.id === courseId ? { ...c, ...courseUpdate } : c
            ),
          }
        : null,
    })),
  addActivity: (activity) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, activities: [...state.user.activities, activity] }
        : null,
    })),
  addMentalWellnessLog: (log) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            mentalWellnessLogs: [...state.user.mentalWellnessLogs, log],
          }
        : null,
    })),
  updateBMI: (bmiData) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            bmiHistory: [...state.user.bmiHistory, bmiData],
          }
        : null,
    })),
  updateTimetable: (timetable) =>
    set((state) => ({
      user: state.user ? { ...state.user, timetable } : null,
    })),
  addNote: (note) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, notes: [...state.user.notes, note] }
        : null,
    })),
  deleteNote: (noteId) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            notes: state.user.notes.filter((note) => note.id !== noteId),
          }
        : null,
    })),
}));