import { ENERGY_CURVE } from './constants';
import { EnergyPoint } from './types';

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Night Owl';
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Good Night';
}

/** Interpolates energy between two ENERGY_CURVE data points for the current hour. */
export function getCurrentEnergy(): EnergyPoint {
  const h = new Date().getHours();

  const exact = ENERGY_CURVE.find(e => e.hour === h);
  if (exact) return exact;

  const sorted = [...ENERGY_CURVE].sort((a, b) => a.hour - b.hour);
  let prev = sorted[0];
  let next = sorted[sorted.length - 1];

  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].hour <= h && sorted[i + 1].hour > h) {
      prev = sorted[i];
      next = sorted[i + 1];
      break;
    }
  }

  const t = (h - prev.hour) / (next.hour - prev.hour);
  const energy = Math.round(prev.energy + t * (next.energy - prev.energy));
  const label = t < 0.5 ? prev.label : next.label;
  return { hour: h, energy, label };
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}

/** Converts a 24-hour integer to "9 AM", "12 PM", etc. */
export function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return hour + ' AM';
  return (hour - 12) + ' PM';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
}

/** Returns today in YYYY-MM-DD format for daily habit reset tracking. */
export function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}
