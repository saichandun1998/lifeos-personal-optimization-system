import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, NavLink, useNavigate, useOutletContext } from 'react-router-dom';
import { Icons, DEFAULT_HABITS } from '../constants';
import {
  getCurrentEnergy,
  formatTime,
  loadFromStorage,
  saveToStorage,
  generateId,
  todayKey,
} from '../utils';
import { Habit, Task, Note, LifeScores, Priority } from '../types';
import { supabase } from '../src/lib/supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface DashboardContextType {
  habits: Habit[];
  tasks: Task[];
  notes: Note[];
  lifeScores: LifeScores;
  user: User | null;
  handleAddTask: (n: string, h: number, p: Priority) => void;
  handleToggleTask: (id: string) => void;
  handleDeleteTask: (id: string) => void;
  handleToggleHabit: (id: string) => void;
  handleAddHabit: (n: string, e: string) => void;
  handleDeleteHabit: (id: string) => void;
  handleAddNote: (text: string) => void;
  handleDeleteNote: (id: string) => void;
  setLifeScores: React.Dispatch<React.SetStateAction<LifeScores>>;
}

export function useDashboard() {
  return useOutletContext<DashboardContextType>();
}

const NAV_ITEMS = [
  { to: '/app', icon: Icons.activity, label: 'Overview', end: true },
  { to: '/app/schedule', icon: Icons.clock, label: 'Schedule', end: false },
  { to: '/app/habits', icon: Icons.flame, label: 'Habits', end: false },
  { to: '/app/radar', icon: Icons.target, label: 'Life Radar', end: false },
  { to: '/app/notes', icon: Icons.lightbulb, label: 'Notes', end: false },
  { to: '/app/decide', icon: Icons.shuffle, label: 'Decide', end: false },
];

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [habits, setHabits] = useState<Habit[]>(() =>
    loadFromStorage('lifeos_habits', DEFAULT_HABITS)
  );
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadFromStorage('lifeos_tasks', [])
  );
  const [notes, setNotes] = useState<Note[]>(() =>
    loadFromStorage('lifeos_notes', [])
  );
  const [lifeScores, setLifeScores] = useState<LifeScores>(() =>
    loadFromStorage('lifeos_scores', {
      health: 6, work: 7, relationships: 5, growth: 4, finance: 6, joy: 7,
    })
  );

  // Auth
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Sync from Supabase
  useEffect(() => {
    const client = supabase;
    if (!user || !client) return;
    const fetchData = async () => {
      const { data, error } = await client.from('user_data').select('*').eq('user_id', user.id).single();
      if (data && !error) {
        if (data.habits) setHabits(data.habits);
        if (data.tasks) setTasks(data.tasks);
        if (data.notes) setNotes(data.notes);
        if (data.scores) setLifeScores(data.scores);
      }
    };
    fetchData();
  }, [user]);

  // Persist to Supabase
  useEffect(() => {
    const client = supabase;
    if (!user || !client) return;
    const syncData = async () => {
      await client.from('user_data').upsert({
        user_id: user.id, habits, tasks, notes, scores: lifeScores,
        updated_at: new Date().toISOString(),
      });
    };
    const timer = setTimeout(syncData, 2000);
    return () => clearTimeout(timer);
  }, [habits, tasks, notes, lifeScores, user]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  // Daily habit reset
  useEffect(() => {
    const today = todayKey();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      let n = { ...h };
      if (h.done && h.lastDone !== today) n.done = false;
      if (h.lastDone && h.lastDone !== today && h.lastDone !== yKey) n.streak = 0;
      return n;
    }));
  }, []);

  // localStorage
  useEffect(() => { saveToStorage('lifeos_habits', habits); }, [habits]);
  useEffect(() => { saveToStorage('lifeos_tasks', tasks); }, [tasks]);
  useEffect(() => { saveToStorage('lifeos_notes', notes); }, [notes]);
  useEffect(() => { saveToStorage('lifeos_scores', lifeScores); }, [lifeScores]);

  // Handlers
  const handleAddTask = useCallback((n: string, h: number, p: Priority) => {
    setTasks(prev => [...prev, { id: generateId(), name: n, hour: h, priority: p, done: false }]);
  }, []);
  const handleToggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  }, []);
  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);
  const handleToggleHabit = useCallback((id: string) => {
    const today = todayKey();
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const nowDone = !h.done;
      return { ...h, done: nowDone, streak: nowDone ? h.streak + 1 : Math.max(0, h.streak - 1), lastDone: nowDone ? today : h.lastDone };
    }));
  }, []);
  const handleAddHabit = useCallback((n: string, e: string) => {
    setHabits(prev => [...prev, { id: generateId(), name: n, emoji: e, streak: 0, done: false }]);
  }, []);
  const handleDeleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);
  const handleAddNote = useCallback((text: string) => {
    setNotes(prev => [{ id: generateId(), text, time: formatTime(new Date()) }, ...prev]);
  }, []);
  const handleDeleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    navigate('/');
  };

  const energy = getCurrentEnergy();

  const ctx: DashboardContextType = {
    habits, tasks, notes, lifeScores, user,
    handleAddTask, handleToggleTask, handleDeleteTask,
    handleToggleHabit, handleAddHabit, handleDeleteHabit,
    handleAddNote, handleDeleteNote, setLifeScores,
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#060608' }}>
      {/* ── Sidebar ── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={[
        'fixed lg:static z-40 flex flex-col h-full w-60 flex-shrink-0 border-r border-white/[0.04] transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')} style={{ background: 'rgba(8,8,14,0.95)', backdropFilter: 'blur(20px)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 pt-6 pb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <span className="text-black scale-90">{Icons.zap}</span>
          </div>
          <span className="text-sm font-bold text-white/70 tracking-wide">LifeOS</span>
        </div>

        {/* Nav */}
        <nav className="flex-grow px-3 space-y-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => [
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'text-white/25 hover:text-white/50 hover:bg-white/[0.03]',
              ].join(' ')}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-6 space-y-2">
          <div className="mx-3 mb-2 h-px bg-white/[0.04]" />
          {user && (
            <div className="px-3 py-2 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-[10px] font-bold text-black flex-shrink-0">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-[11px] text-white/30 truncate">{user.email}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/20 hover:text-white/40 hover:bg-white/[0.03] transition-all"
          >
            {Icons.user}
            {user ? 'Log out' : 'Sign in'}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] flex-shrink-0" style={{ background: 'rgba(6,6,8,0.8)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="lg:hidden text-white/30 hover:text-white/60 transition-colors"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <div className="text-sm font-medium text-white/40">{formatTime(now)}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(245,158,11,0.08)', color: '#F59E0B' }}>
              {Icons.zap}
              <span className="tabular-nums">{energy.energy}%</span>
            </div>
            {user && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-[10px] font-bold text-black">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-grow overflow-y-auto p-6 lg:p-8">
          <Outlet context={ctx} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
