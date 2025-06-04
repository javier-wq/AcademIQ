// Authentication types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Subject types
export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  cycle: string;
  teachers: string[];
}

// Teacher types
export interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
}

// Task types
export interface Task {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  dueDate: string;
  percentage: number;
  teacherId: string;
  status: 'pending' | 'completed' | 'late';
  createdAt: string;
}

// Note types
export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  createdAt: string;
  updatedAt: string;
}

// File types
export interface File {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  subjectId: string;
  uploadedAt: string;
}

// Flashcard types
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subjectId: string;
  createdAt: string;
}

// Quiz types
export interface Quiz {
  id: string;
  title: string;
  subjectId: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Schedule types
export interface ScheduleEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  subjectId?: string;
  teacherId?: string;
  location?: string;
  type: 'class' | 'activity' | 'task';
}

// Pomodoro types
export interface PomodoroSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}

export interface PomodoroState {
  isActive: boolean;
  isPaused: boolean;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  timeLeft: number;
  currentSession: number;
  settings: PomodoroSettings;
}

// Statistics types
export interface StudyStatistics {
  totalStudyTime: number;
  weeklyStudyTime: number[];
  subjectDistribution: Record<string, number>;
  completedTasks: number;
  pendingTasks: number;
  upcomingDeadlines: Task[];
}