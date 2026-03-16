
import { EnergyPoint, Habit } from './types';

export const Icons = {
  zap: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
  clock: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  activity: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
  flame: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 3.5 3 4 2.107 1.053 3 3.411 3 6a5 5 0 0 1-10 0z"></path></svg>,
  target: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
  lightbulb: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6m-5 4h4m1-10a5 5 0 1 1-10 0c0-2.5 2-4 2-6a3 3 0 1 1 6 0c0 2-2 3.5-2 6z"></path></svg>,
  shuffle: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>,
  trash: <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  check: <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  plus: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  chevDown: <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  info: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
  user: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
};

export const ENERGY_CURVE: EnergyPoint[] = [
  { hour: 0, energy: 20, label: "Deep Rest" },
  { hour: 5, energy: 30, label: "Waking" },
  { hour: 7, energy: 60, label: "Ascending" },
  { hour: 9, energy: 85, label: "Peak Performance" },
  { hour: 11, energy: 95, label: "Maximum Focus" },
  { hour: 13, energy: 65, label: "Post-Lunch Dip" },
  { hour: 15, energy: 75, label: "Secondary Flow" },
  { hour: 18, energy: 50, label: "Wind Down" },
  { hour: 20, energy: 35, label: "Evening Chill" },
  { hour: 22, energy: 15, label: "Shut Down" },
];

export const MOTIVATIONAL_QUOTES = [
  "Energy flows where attention goes.",
  "Optimize for peace, not just productivity.",
  "Consistency beats intensity in the long game.",
  "Your system is only as good as your smallest habit.",
  "Focus is a finite resource. Spend it wisely."
];

export const DEFAULT_HABITS: Habit[] = [
  { id: '1', name: "Morning Sunlight", emoji: "☀️", streak: 5, done: false },
  { id: '2', name: "Deep Work Block", emoji: "💻", streak: 12, done: false },
  { id: '3', name: "Gratitude Journal", emoji: "✍️", streak: 8, done: false }
];

export const LIFE_DIMENSIONS = [
  { key: 'health', label: 'Health', color: '#ff4d4d' },
  { key: 'work', label: 'Work', color: '#4d96ff' },
  { key: 'relationships', label: 'Social', color: '#ff4db8' },
  { key: 'growth', label: 'Mind', color: '#6bcb77' },
  { key: 'finance', label: 'Wealth', color: '#ffd93d' },
  { key: 'joy', label: 'Play', color: '#a66cff' },
];

export const DECISION_CATEGORIES = [
  { category: "What to Eat", options: ["Poke Bowl", "Homemade Pasta", "Mediterranean Salad", "Intermittent Fasting"] },
  { category: "Next Task", options: ["High Impact Work", "Admin/Email Cleanup", "Strategy Brainstorm", "Skill Practice"] },
  { category: "Break Activity", options: ["Quick Walk", "5-Min Meditation", "Power Nap", "Read 5 Pages"] },
  { category: "Workout Type", options: ["Yoga Flow", "Heavy Lifting", "Zone 2 Cardio", "Active Recovery"] }
];
