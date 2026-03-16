import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
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
  const [activeNav, setActiveNav] = useState('scheduler');

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

    const timer = setTimeout(syncData, 2000);
    return () => clearTimeout(timer);
  }, [habits, tasks, notes, lifeScores, user]);

  // Clock — ticks every 30s
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
        if (h.done && h.lastDone !== today) {
          newHabit.done = false;
        }
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

  // ── Task handlers ──
  const handleAddTask = useCallback((n: string, h: number, p: Priority) => {
    setTasks(prev => [...prev, { id: generateId(), name: n, hour: h, priority: p, done: false }]);
  }, []);
  const handleToggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  }, []);
  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Habit handlers ──
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

  // ── Note handlers ──
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

  const scrollTo = (id: string) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { label: 'Energy', value: currentEnergy.energy + '%', color: '#F59E0B', icon: Icons.zap, desc: currentEnergy.label },
    { label: 'Day Progress', value: Math.round(dayProgress) + '%', color: '#3B82F6', icon: Icons.clock, desc: 'Elapsed' },
    { label: 'Tasks Done', value: completionRate + '%', color: '#10B981', icon: Icons.target, desc: 'Complete' },
  ];

  return (
    <div className="min-h-screen pb-32" style={{ background: '#060608' }}>

      {/* ── Animated background orbs ── */}
      <div
        className="bg-orb"
        style={{
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(245,158,11,0.12), transparent)',
          top: -200, right: -100,
          animation: 'orb-1 25s ease-in-out infinite',
        }}
      />
      <div
        className="bg-orb"
        style={{
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(59,130,246,0.08), transparent)',
          bottom: -150, left: -100,
          animation: 'orb-2 30s ease-in-out infinite',
        }}
      />
      <div
        className="bg-orb"
        style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(139,92,246,0.06), transparent)',
          top: '40%', left: '50%',
          animation: 'orb-3 20s ease-in-out infinite',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">

        {/* ── Header ── */}
        <header className="pt-14 pb-10 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-14">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <span className="text-black">{Icons.zap}</span>
              </div>
              <span className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">
                LifeOS
              </span>
            </div>
            <button
              onClick={() => setFocusMode(f => !f)}
              className={[
                'px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all',
                focusMode
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                  : 'bg-white/[0.03] text-white/25 hover:bg-white/[0.06] border border-white/[0.06]',
              ].join(' ')}
            >
              {focusMode ? '● Focus Active' : 'Engage Focus'}
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center space-y-5"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold gradient-text tracking-tight leading-none">
              {getGreeting()}
            </h1>
            <div className="flex items-center justify-center gap-6 text-sm font-medium text-white/20 tabular-nums">
              <div className="flex items-center gap-2">
                <span className="text-amber-500/40">{Icons.clock}</span>
                {formatTime(now)}
              </div>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <div>{formatDate(now)}</div>
            </div>
            <p className="text-xs text-white/12 italic max-w-xs mx-auto font-medium">
              &ldquo;{quote}&rdquo;
            </p>
          </motion.div>
        </header>

        {/* ── Stats Strip ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className="relative p-5 rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div
                className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-20 blur-3xl"
                style={{ background: stat.color }}
              />
              <div className="relative flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: stat.color + '12', color: stat.color }}
                >
                  {stat.icon}
                </div>
                <span className="text-[10px] font-bold text-white/25 uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
              <div className="relative flex items-baseline gap-2">
                <span className="text-3xl font-bold tabular-nums" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="text-xs text-white/15 font-medium">{stat.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            <div id="scheduler" className="section-anchor">
              <Card title="Energy-Sync Scheduler" icon={Icons.activity} accentColor="#F59E0B">
                <div className="space-y-8 pt-2">
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
                  <Card title="Quick Sparks" icon={Icons.lightbulb} accentColor="#EAB308">
                    <QuickCapture notes={notes} onAdd={handleAddNote} onDelete={handleDeleteNote} />
                  </Card>
                </div>
                <Card title="Decision Dice" icon={Icons.shuffle} accentColor="#8B5CF6">
                  <DecisionMaker />
                </Card>
              </div>
            )}
          </div>

          {/* Right column (1/3) */}
          <div className="space-y-8">
            {!focusMode && (
              <div id="radar" className="section-anchor">
                <Card title="Life Equilibrium" icon={Icons.target} accentColor="#3B82F6">
                  <LifeRadar
                    scores={lifeScores}
                    onUpdate={(k, v) => setLifeScores(prev => ({ ...prev, [k]: v }))}
                  />
                </Card>
              </div>
            )}
            <div id="habits" className="section-anchor">
              <Card title="Micro-Habit Loops" icon={Icons.flame} accentColor="#10B981">
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

        {/* ── About ── */}
        {!focusMode && (
          <div id="about" className="mt-24 section-anchor">
            <div className="flex items-center gap-6 mb-10">
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
              <h2 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">System Protocol</h2>
              <div className="h-px flex-grow bg-gradient-to-l from-transparent via-white/[0.06] to-transparent" />
            </div>
            <About />
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="mt-24 pb-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/12 uppercase tracking-widest">
              <span className="relative w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
                <span className="absolute inset-0 rounded-full bg-emerald-400" />
              </span>
              System Online
            </div>
          </div>
        </footer>
      </div>

      {/* ── Bottom Nav Dock ── */}
      <nav className="glass-dock fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-3 px-6">
        {NAV_SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={[
              'flex flex-col items-center gap-1 transition-colors group relative',
              activeNav === s.id ? 'text-amber-400' : 'text-white/20 hover:text-white/40',
            ].join(' ')}
          >
            {activeNav === s.id && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -top-3 w-6 h-0.5 rounded-full bg-amber-400"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="group-hover:scale-110 transition-transform">{Icons[s.icon]}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest">{s.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
