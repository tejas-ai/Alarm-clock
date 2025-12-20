export interface Alarm {
  id: string;
  time: string; // "HH:MM" format
  period: 'am' | 'pm';
  isActive: boolean;
  label?: string;
  days: string[]; // ["Mon", "Tue", ...]
  sound?: {
    name: string;
    url?: string;
  };
  effects?: {
    fade: boolean;
    vibrate: boolean;
  };
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  reminder?: number; // timestamp
  reminderFired?: boolean;
}

export interface UserStats {
  luminaIndex: number;
  tasksCompleted: number;
  alarmsConsistency: number; // 0-100
  streak: number;
}

export type NavTab = 'Clock' | 'World' | 'Alarm' | 'Focus' | 'Calendar' | 'Stopwatch' | 'Timer' | 'Settings';

export interface Lap {
  id: number;
  time: string;
}

export interface WorldCity {
  id: string;
  name: string;
  timezone: string;
}