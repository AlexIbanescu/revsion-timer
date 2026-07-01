export type TimerPhase = 'work' | 'shortBreak5' | 'shortBreak10' | 'longBreak';

export interface TimerSettings {
  workDuration: number;
  shortBreakDuration: 5 | 10;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  focusMode: boolean;
  theme: 'dark' | 'light';
}

export interface Session {
  id: string;
  phase: TimerPhase;
  duration: number;
  completed: boolean;
  timestamp: number;
  abandoned?: boolean;
}

export interface Statistics {
  totalSessions: number;
  totalMinutes: number;
  todaysSessions: number;
  todaysMinutes: number;
  weeklyData: { day: string; minutes: number }[];
  streak: number;
  longestStreak: number;
}