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

export type NavTab = 'Clock' | 'Alarm' | 'Focus' | 'Stopwatch' | 'Settings';

export interface Lap {
  id: number;
  time: string;
}