export interface Course {
  id: string;
  name: string;
  credits: number;
  grade?: string;
  attendance: number;
  totalClasses: number;
  assignments: Assignment[];
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Activity {
  id: string;
  name: string;
  date: string;
  type: 'cultural' | 'club' | 'other';
  description: string;
}

export interface MentalWellnessLog {
  id: string;
  date: string;
  stressLevel: number;
  mood: string;
  notes: string;
}

export interface Note {
  id: string;
  title: string;
  courseId: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  uploadDate: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  courses: Course[];
  activities: Activity[];
  mentalWellnessLogs: MentalWellnessLog[];
  notes: Note[];
  bmiHistory: {
    date: string;
    bmi: number;
    weight: number;
    height: number;
  }[];
  timetable: {
    day: string;
    slots: {
      time: string;
      course: string;
    }[];
  }[];
}