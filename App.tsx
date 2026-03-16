import React, { useState, useEffect, useCallback } from 'react';
import { Icons, MOTIVATIONAL_QUOTES, DEFAULT_HABITS } from './constants';
import {
  getGreeting,
  getCurrentEnergy,
  formatDate,
  formatTime,
  loadFromStorage,
  saveToStorage,
  generateId,
  todayKey,
} from './utils';
import { Habit, Task, Note, LifeScores, Priority } from './types';
import Card from './components/Card';
import EnergyCurve from './components/EnergyCurve';
import HabitTracker from './components/HabitTracker';
import LifeRadar from './components/LifeRadar';
import DecisionMaker from './components/DecisionMaker';
import QuickCapture from './components/QuickCapture';
import TaskScheduler from './components/TaskScheduler';
import About from './components/About';
import Auth from './components/Auth';
import { supabase } from './src/lib/supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

type NavIconKey = 'activity' | 'lightbulb' | 'target' | 'flame' | 'info' | 'user';

const NAV_SECTIONS: { id: string; label: string; icon: NavIconKey }[] = [
  { id: 'scheduler', label: 'Schedule', icon: 'activity' },
  { id: 'sparks', label: 'Sparks', icon: 'lightbulb' },
  { id: 'radar', label: 'Radar', icon: 'target' },
  { id: 'habits', label: 'Habits', icon: 'flame' },
  { id: 'about', label: 'Protocol', icon: 'info' },
  { id: 'auth', label: 'Account', icon: 'user' },
];

const App: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [user, setUser] = useState<User | null>(null);
  const [quote] = useState(
    () => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
  );
  const [focusMode, setFocusMode] = useState(false);

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

  // Auth Listener
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

  // Sync data from Supabase if logged in
  useEffect(() => {
    const client = supabase;
    if (!user || !client) return;

    const fetchData = async () => {
      const { data, error } = await client
        .from('user_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        if (data.habits) setHabits(data.habits);
        if (data.tasks) setTasks(data.tasks);
        if (data.notes) setNotes(data.notes);
        if (data.scores) setLifeScores(data.scores);
      }
    };

    fetchData();
  }, [user]);

  // Persist to Supabase if logged in
  useEffect(() => {
    const client = supabase;
    if (!user || !client) return;

    const syncData = async () => {
      await client.from('user_data').upsert({
        user_id: user.id,
        habits,
        tasks,
        notes,
        scores: lifeScores,
        updated_at: new Date().toISOString(),
      });
    };

    const timer = setTimeout(syncData, 2000); // Debounce sync
    return () => clearTimeout(timer);
  }, [habits, tasks, notes, lifeScores, user]);

  // Clock — ticks every 30 s
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  // Daily habit reset and streak validation
  useEffect(() => {
    const today = todayKey();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().split('T')[0];

    setHabits(prev => {
      return prev.map(h => {
        let newHabit = { ...h };
        
        // Reset 'done' status for the new day
        if (h.done && h.lastDone !== today) {
          newHabit.done = false;
        }

        // Break streak if missed a day
        if (h.lastDone && h.lastDone !== today && h.lastDone !== yKey) {
          newHabit.streak = 0;
        }

        return newHabit;
      });
    });
  }, []);

  // Persist to localStorage
  useEffect(() => { saveToStorage('lifeos_habits', habits); }, [habits]);
  useEffect(() => { saveToStorage('lifeos_tasks', tasks); }, [tasks]);
  useEffect(() => { saveToStorage('lifeos_notes', notes); }, [notes]);
  useEffect(() => { saveToStorage('lifeos_scores', lifeScores); }, [lifeScores]);

  // ── Task handlers ──────────────────────────────────────────────────────────
  const handleAddTask = useCallback((n: string, h: number, p: Priority) => {
    setTasks(prev => [...prev, { id: generateId(), name: n, hour: h, priority: p, done: false }]);
  }, []);

  const handleToggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Habit handlers ─────────────────────────────────────────────────────────
  const handleToggleHabit = useCallback((id: string) => {
    const today = todayKey();
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== id) return h;
        const nowDone = !h.done;
        return {
          ...h,
          done: nowDone,
          streak: nowDone ? h.streak + 1 : Math.max(0, h.streak - 1),
          lastDone: nowDone ? today : h.lastDone,
        };
      })
    );
  }, []);

  const handleAddHabit = useCallback((n: string, e: string) => {
    setHabits(prev => [...prev, { id: generateId(), name: n, emoji: e, streak: 0, done: false }]);
  }, []);

  const handleDeleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  // ── Note handlers ──────────────────────────────────────────────────────────
  const handleAddNote = useCallback((text: string) => {
    setNotes(prev => [{ id: generateId(), text, time: formatTime(new Date()) }, ...prev]);
  }, []);

  const handleDeleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const currentEnergy = getCurrentEnergy();
  const dayProgress = Math.min(100, Math.max(0, ((now.getHours() - 5) / 17) * 100));
  const completionRate = Math.round(
    (tasks.filter(t => t.done).length / (tasks.length || 1)) * 100
  );

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const stats = [
    { label: 'Energy Flux', value: currentEnergy.energy + '%', color: 'text-orange-400', bg: 'bg-orange-500/5', icon: Icons.zap, desc: currentEnergy.label },
    { label: 'Operational Day', value: Math.round(dayProgress) + '%', color: 'text-blue-400', bg: 'bg-blue-600/5', icon: Icons.clock, desc: 'Day elapsed' },
    { label: 'Objective Velocity', value: completionRate + '%', color: 'text-green-400', bg: 'bg-green-500/5', icon: Icons.target, desc: 'Tasks complete' },
  ];

  return (
    <div
      className="min-h-screen pb-32 transition-colors duration-700"
      style={{ background: focusMode ? '#020202' : '#050505', color: '#fff' }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">

        {/* ── Header ──────────────────────────────────────── */}
        <header className="pt-12 pb-8 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-black">{Icons.zap}</span>
              </div>
              <span className="text-xs font-bold text-white/40 uppercase tracking-[0.3em]">
                LifeOS Protocol
              </span>
            </div>
            <button
              onClick={() => setFocusMode(f => !f)}
              aria-label={focusMode ? 'Disable focus mode' : 'Enable focus mode'}
              className={[
                'px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all',
                focusMode
                  ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/30'
                  : 'bg-white/5 text-white/40 hover:bg-white/10',
              ].join(' ')}
            >
              {focusMode ? 'Focus Active' : 'Engage Focus'}
            </button>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight leading-none">
              {getGreeting()}
            </h1>
            <div className="flex items-center justify-center gap-6 text-sm font-medium text-white/30 tabular-nums">
              <div className="flex items-center gap-2">
                <span className="text-orange-500/60">{Icons.clock}</span>
                {formatTime(now)}
              </div>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <div>{formatDate(now)}</div>
            </div>
          </div>
        </header>

        {/* ── Global Stats ────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className={'p-6 rounded-3xl border border-white/5 ' + stat.bg + ' flex flex-col'}>
              <div className="flex items-center gap-3 mb-2">
                <span className={stat.color}>{stat.icon}</span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={'text-3xl font-bold tabular-nums ' + stat.color}>{stat.value}</span>
                <span className="text-xs text-white/20 font-medium">{stat.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Grid ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <div className="lg:col-span-2 space-y-8">
            <div id="scheduler" className="section-anchor">
              <Card title="Energy-Sync Scheduler" icon={Icons.activity} accentColor="#ff9500">
                <div className="space-y-8 pt-4">
                  <EnergyCurve tasks={tasks} />
                  <TaskScheduler
                    tasks={tasks}
                    onAdd={handleAddTask}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                </div>
              </Card>
            </div>

            {!focusMode && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div id="sparks" className="section-anchor">
                  <Card title="Quick Sparks" icon={Icons.lightbulb} accentColor="#ffd93d">
                    <QuickCapture notes={notes} onAdd={handleAddNote} onDelete={handleDeleteNote} />
                  </Card>
                </div>
                <Card title="Decision Dice" icon={Icons.shuffle} accentColor="#a66cff">
                  <DecisionMaker />
                </Card>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {!focusMode && (
              <div id="radar" className="section-anchor">
                <Card title="Life Equilibrium" icon={Icons.target} accentColor="#4d96ff">
                  <LifeRadar
                    scores={lifeScores}
                    onUpdate={(k, v) => setLifeScores(prev => ({ ...prev, [k]: v }))}
                  />
                </Card>
              </div>
            )}
            <div id="habits" className="section-anchor">
              <Card title="Micro-Habit Loops" icon={Icons.flame} accentColor="#6bcb77">
                <HabitTracker
                  habits={habits}
                  onToggle={handleToggleHabit}
                  onAdd={handleAddHabit}
                  onDelete={handleDeleteHabit}
                />
              </Card>
            </div>

            {!focusMode && (
              <div id="auth" className="section-anchor">
                <Auth />
              </div>
            )}
          </div>
        </div>

        {/* ── About Section ───────────────────────────────── */}
        {!focusMode && (
          <div id="about" className="mt-24 section-anchor">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-grow bg-white/10" />
              <h2 className="text-xs font-bold text-white/30 uppercase tracking-[0.4em]">System Documentation</h2>
              <div className="h-px flex-grow bg-white/10" />
            </div>
            <About />
          </div>
        )}

        {/* ── Footer ──────────────────────────────────────── */}
        <footer className="mt-24 pb-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Online • v1.0.4
            </div>
            <p className="text-[10px] text-white/30 italic max-w-xs">
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        </footer>
      </div>

      {/* ── Bottom Nav Dock ─────────────────────────────── */}
      <nav className="glass-dock fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-3 px-6">
        {NAV_SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            aria-label={'Go to ' + s.label}
            className="flex flex-col items-center gap-1 text-white/30 hover:text-orange-400 transition-colors group"
          >
            <span className="group-hover:scale-110 transition-transform">{Icons[s.icon]}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest">{s.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
