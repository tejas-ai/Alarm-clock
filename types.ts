
export interface Alarm {
  id: string;
  time: string; // "HH:MM" format
  period: 'am' | 'pm';
  isActive: boolean;
  sunriseEnabled?: boolean;
  label?: string;
}

export type NavTab = 'Clock' | 'Alarm' | 'Stopwatch' | 'Timer';

export interface Lap {
  id: number;
  time: string;
}
