
export interface Alarm {
  id: string;
  time: string;
  period: 'am' | 'pm';
  isActive: boolean;
}

export type NavTab = 'Clock' | 'Alarm' | 'Stopwatch' | 'Timer';

export interface Lap {
  id: number;
  time: string;
}
