
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

export type NavTab = 'Clock' | 'Alarm' | 'Stopwatch' | 'Timer' | 'Settings';

export interface Lap {
  id: number;
  time: string;
}
