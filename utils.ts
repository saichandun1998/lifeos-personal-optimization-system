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

/** Suggests the best hour to schedule a task based on energy and existing tasks */
export function suggestOptimalHour(priority: 'high' | 'medium' | 'low', existingTasks: { hour: number }[]): number {
  const now = new Date().getHours();
  const occupiedHours = new Set(existingTasks.map(t => t.hour));

  // Get future energy data points (only hours that haven't passed)
  const futurePoints = ENERGY_CURVE
    .filter(e => e.hour > now && e.hour >= 5 && e.hour <= 22)
    .sort((a, b) => b.energy - a.energy); // sort by energy descending

  if (futurePoints.length === 0) {
    // All hours passed, suggest tomorrow morning
    return 9;
  }

  // High priority → highest energy available hour
  // Medium priority → medium energy hour
  // Low priority → lowest energy hour (save peak for important work)
  let candidates: typeof futurePoints;

  if (priority === 'high') {
    candidates = futurePoints; // already sorted highest first
  } else if (priority === 'medium') {
    // Middle energy hours
    const mid = Math.floor(futurePoints.length / 2);
    candidates = [...futurePoints.slice(mid), ...futurePoints.slice(0, mid)];
  } else {
    // Low priority → lowest energy hours first
    candidates = [...futurePoints].reverse();
  }

  // Find first available (not occupied) hour
  for (const point of candidates) {
    if (!occupiedHours.has(point.hour)) {
      return point.hour;
    }
  }

  // All optimal hours taken, return the best one anyway
  return candidates[0]?.hour ?? 9;
}

/** Returns energy-based scheduling advice for a given hour */
export function getSchedulingAdvice(hour: number, priority: 'high' | 'medium' | 'low'): string {
  const point = ENERGY_CURVE.find(e => e.hour === hour);
  const energy = point?.energy ?? 50;

  if (priority === 'high' && energy < 50) {
    return '\u26A0 Low energy period \u2014 consider moving this to a peak hour';
  }
  if (priority === 'high' && energy >= 80) {
    return '\u2713 Perfect \u2014 this is your peak energy window';
  }
  if (priority === 'high' && energy >= 60) {
    return '\u2192 Good energy, but you have higher peaks available';
  }
  if (priority === 'low' && energy >= 80) {
    return '\uD83D\uDCA1 Tip: Save peak energy for high-priority tasks';
  }
  return '';
}
