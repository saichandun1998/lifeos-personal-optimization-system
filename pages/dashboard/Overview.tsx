import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Icons, MOTIVATIONAL_QUOTES } from '../../constants';
import { useDashboard } from '../DashboardLayout';
import { getCurrentEnergy, getGreeting, todayKey } from '../../utils';
import EnergyCurve from '../../components/EnergyCurve';
import MiniRadar from '../../components/MiniRadar';
import AICoach from '../../components/AICoach';

const Overview: React.FC = () => {
  const { habits, tasks, notes, lifeScores, focusSessions } = useDashboard();

  const energy = getCurrentEnergy();
  const now = new Date();
  const dayProgress = Math.min(100, Math.max(0, ((now.getHours() - 5) / 17) * 100));
  const tasksDone = tasks.filter(t => t.done).length;
  const completionRate = Math.round((tasksDone / (tasks.length || 1)) * 100);
  const habitsDone = habits.filter(h => h.done).length;
  const avg = (Object.values(lifeScores).reduce((a, b) => a + b, 0) / 6).toFixed(1);
  const todayFocus = focusSessions.filter(s => s.startedAt.startsWith(todayKey()));
  const focusMins = todayFocus.reduce((sum, s) => sum + s.duration, 0);

  const quote = useMemo(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)], []);

  const stats = [
    { label: 'Energy', value: energy.energy + '%', desc: energy.label, color: '#f0a030', icon: Icons.zap },
    { label: 'Day Progress', value: Math.round(dayProgress) + '%', desc: 'Elapsed', color: '#3B82F6', icon: Icons.clock },
    { label: 'Tasks', value: `${tasksDone}/${tasks.length}`, desc: `${completionRate}% done`, color: '#10B981', icon: Icons.target },
    { label: 'Focus Today', value: `${focusMins}m`, desc: `${todayFocus.length} sessions`, color: '#8B5CF6', icon: Icons.timer },
  ];

  return (
    <div className="max-w-7xl space-y-8">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-1">{getGreeting()}</h1>
        <p className="text-sm text-white/25 font-medium">Here's your operational status.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="stat-card relative p-4 rounded-2xl overflow-hidden border border-white/[0.04]"
            style={{ background: 'rgba(255,255,255,0.02)', '--stat-color': s.color + '40' } as React.CSSProperties}
          >
            <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-15 blur-2xl" style={{ background: s.color }} />
            <div className="relative flex items-center gap-2 mb-2">
              <span style={{ color: s.color }}>{s.icon}</span>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{s.label}</span>
            </div>
            <div className="relative">
              <span className="text-2xl font-display font-bold tabular-nums" style={{ color: s.color }}>{s.value}</span>
              <span className="ml-2 text-[11px] text-white/15 font-medium">{s.desc}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Coach */}
      <AICoach habits={habits} tasks={tasks} lifeScores={lifeScores} focusSessions={focusSessions} />

      {/* Two-column: Energy Curve + Focus CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div
          className="lg:col-span-3 p-6 rounded-2xl border border-white/[0.04]"
          style={{ background: 'rgba(255,255,255,0.015)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-semibold text-white/60">Energy Curve</h2>
            <Link to="/app/schedule" className="text-[10px] font-bold text-amber-400/50 hover:text-amber-400 uppercase tracking-widest transition-colors">Schedule &rarr;</Link>
          </div>
          <EnergyCurve tasks={tasks} />
        </motion.div>

        <motion.div
          className="lg:col-span-2 space-y-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Focus CTA */}
          <Link
            to="/app/focus"
            className="block p-6 rounded-2xl border border-amber-500/15 hover:border-amber-500/25 transition-all group"
            style={{ background: 'rgba(240,160,48,0.04)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-400">
                {Icons.timer}
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-white group-hover:text-amber-400 transition-colors">Start Focus Session</h3>
                <p className="text-[11px] text-white/25">Energy: {energy.energy}% — {energy.label}</p>
              </div>
            </div>
            <div className="text-xs text-white/20 font-medium">
              {energy.energy >= 60 ? 'Great time for deep work' : 'Try a short burst or take a break'} &rarr;
            </div>
          </Link>

          {/* Upcoming tasks */}
          <div className="p-5 rounded-2xl border border-white/[0.04]" style={{ background: 'rgba(255,255,255,0.015)' }}>
            <h3 className="text-xs font-display font-bold text-white/30 uppercase tracking-widest mb-3">Next Up</h3>
            {tasks.filter(t => !t.done).slice(0, 3).length === 0 ? (
              <p className="text-xs text-white/15 font-medium">No tasks scheduled. <Link to="/app/schedule" className="text-amber-400/50 hover:text-amber-400">Add one &rarr;</Link></p>
            ) : (
              <div className="space-y-2">
                {tasks.filter(t => !t.done).sort((a, b) => a.hour - b.hour).slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-center gap-2 text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full ${t.priority === 'high' ? 'bg-red-400' : t.priority === 'medium' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                    <span className="text-white/50 truncate">{t.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Three-column: Habits + Radar + Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/app/habits" className="group relative p-5 rounded-2xl border border-white/[0.04] hover:border-white/[0.08] transition-all overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)' }}>
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-emerald-500" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400">{Icons.flame}</div>
            <span className="text-sm font-display font-semibold text-white/60 group-hover:text-white/80 transition-colors">Habits</span>
          </div>
          <p className="text-2xl font-display font-bold text-emerald-400 tabular-nums">{habitsDone}/{habits.length}</p>
          <p className="text-[11px] text-white/20 font-medium mt-1">completed today</p>
        </Link>

        <Link to="/app/habits" className="group relative p-5 rounded-2xl border border-white/[0.04] hover:border-white/[0.08] transition-all overflow-hidden flex flex-col items-center justify-center" style={{ background: 'rgba(255,255,255,0.015)' }}>
          <MiniRadar scores={lifeScores} />
          <p className="text-[11px] text-white/20 font-medium mt-2">Balance: {avg}</p>
        </Link>

        <Link to="/app/journal" className="group relative p-5 rounded-2xl border border-white/[0.04] hover:border-white/[0.08] transition-all overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)' }}>
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-amber-400" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-400/10 text-amber-400">{Icons.journal}</div>
            <span className="text-sm font-display font-semibold text-white/60 group-hover:text-white/80 transition-colors">Journal</span>
          </div>
          <p className="text-2xl font-display font-bold text-amber-400 tabular-nums">{notes.length}</p>
          <p className="text-[11px] text-white/20 font-medium mt-1">sparks captured</p>
        </Link>
      </div>

      {/* Quote */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center py-4">
        <p className="text-sm text-white/15 italic font-display">&ldquo;{quote}&rdquo;</p>
      </motion.div>
    </div>
  );
};

export default Overview;
