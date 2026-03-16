
export interface Habit {
  id: string;
  name: string;
  streak: number;
  done: boolean;
  emoji: string;
  /** YYYY-MM-DD of last completion — used to detect new-day resets. */
  lastDone?: string;
}

export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  name: string;
  hour: number;
  priority: Priority;
  done: boolean;
}

export interface Note {
  id: string;
  text: string;
  time: string;
}

export interface LifeScores {
  health: number;
  work: number;
  relationships: number;
  growth: number;
  finance: number;
  joy: number;
}

export interface EnergyPoint {
  hour: number;
  energy: number;
  label: string;
}
