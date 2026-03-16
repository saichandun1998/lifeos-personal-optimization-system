import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Icons, MOTIVATIONAL_QUOTES } from '../../constants';
import { useDashboard } from '../DashboardLayout';
import { getCurrentEnergy, getGreeting } from '../../utils';
import { useMemo } from 'react';
import EnergyCurve from '../../components/EnergyCurve';

const Overview: React.FC = () => {
  const { habits, tasks, notes, lifeScores } = useDashboard();

  const energy = getCurrentEnergy();
  const now = new Date();
  const dayProgress = Math.min(100, Math.max(0, ((now.getHours() - 5) / 17) * 100));
  const tasksDone = tasks.filter(t => t.done).length;
  const completionRate = Math.round((tasksDone / (tasks.length || 1)) * 100);
  const habitsDone = habits.filter(h => h.done).length;
  const avg = (Object.values(lifeScores).reduce((a, b) => a + b, 0) / 6).toFixed(1);

  const quote = useMemo(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)], []);

  const stats = [
    { label: 'Energy', value: energy.energy + '%', desc: energy.label, color: '#F59E0B', icon: Icons.zap },
    { label: 'Day Progress', value: Math.round(dayProgress) + '%', desc: 'Elapsed', color: '#3B82F6', icon: Icons.clock },
    { label: 'Tasks', value: `${tasksDone}/${tasks.length}`, desc: `${completionRate}% done`, color: '#10B981', icon: Icons.target },
    { label: 'Habits', value: `${habitsDone}/${habits.length}`, desc: 'Completed today', color: '#8B5CF6', icon: Icons.flame },
  ];

  return (
    <div className="max-w-5xl space-y-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-1">{getGreeting()}</h1>
        <p className="text-sm text-white/25 font-medium">Here's your operational status.</p>
      </motion.div>

      {/* Welcome / Onboarding (shown when there are 0 tasks) */}
      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl border border-amber-500/20"
          style={{ background: 'rgba(245,158,11,0.04)' }}
        >
          <h2 className="text-lg font-bold text-white mb-2">Welcome to LifeOS</h2>
          <p className="text-sm text-white/40 mb-4 leading-relaxed font-medium">
            Your personal optimization command center. Get started by exploring the tools below:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { to: '/app/schedule', label: 'Schedule', desc: 'Plan tasks around your energy curve', icon: Icons.clock, color: '#3B82F6' },
              { to: '/app/habits', label: 'Habits', desc: 'Build streaks with daily habits', icon: Icons.flame, color: '#10B981' },
              { to: '/app/radar', label: 'Life Radar', desc: 'Rate and balance 6 life dimensions', icon: Icons.target, color: '#8B5CF6' },
              { to: '/app/notes', label: 'Quick Notes', desc: 'Capture ideas before they vanish', icon: Icons.lightbulb, color: '#EAB308' },
              { to: '/app/decide', label: 'Decide', desc: 'Break analysis paralysis instantly', icon: Icons.shuffle, color: '#EC4899' },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="group flex items-center gap-3 p-3 rounded-xl border border-white/[0.04] hover:border-white/[0.1] transition-all"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: item.color + '15', color: item.color }}>
                  {item.icon}
                </div>
                <div>
                  <span className="text-sm font-semibold text-white/70 group-hover:text-white/90 transition-colors">{item.label}</span>
                  <p className="text-[11px] text-white/25 font-medium">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="relative p-4 rounded-2xl overflow-hidden border border-white/[0.04]"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-15 blur-2xl" style={{ background: s.color }} />
            <div className="relative flex items-center gap-2 mb-2">
              <span style={{ color: s.color }}>{s.icon}</span>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{s.label}</span>
            </div>
            <div className="relative">
              <span className="text-2xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</span>
              <span className="ml-2 text-[11px] text-white/15 font-medium">{s.desc}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Energy Curve */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl border border-white/[0.04]"
        style={{ background: 'rgba(255,255,255,0.015)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white/60">Energy Curve</h2>
          <Link to="/app/schedule" className="text-[10px] font-bold text-amber-400/50 hover:text-amber-400 uppercase tracking-widest transition-colors">View Schedule &rarr;</Link>
        </div>
        <EnergyCurve tasks={tasks} />
      </motion.div>

      {/* Quick Links (with colored left borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/app/habits', label: 'Habits', desc: `${habitsDone}/${habits.length} done today`, icon: Icons.flame, color: '#10B981' },
          { to: '/app/radar', label: 'Life Radar', desc: `Balance score: ${avg}`, icon: Icons.target, color: '#3B82F6' },
          { to: '/app/notes', label: 'Quick Notes', desc: `${notes.length} sparks captured`, icon: Icons.lightbulb, color: '#EAB308' },
        ].map((item, i) => (
          <Link
            key={i}
            to={item.to}
            className="group relative p-4 rounded-2xl border border-white/[0.04] hover:border-white/[0.08] transition-all overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.015)' }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: item.color }} />
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: item.color + '15', color: item.color }}>
                {item.icon}
              </div>
              <span className="text-sm font-semibold text-white/60 group-hover:text-white/80 transition-colors">{item.label}</span>
            </div>
            <p className="text-xs text-white/20 font-medium pl-11">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center py-6"
      >
        <p className="text-sm text-white/20 italic font-medium">&ldquo;{quote}&rdquo;</p>
      </motion.div>
    </div>
  );
};

// Fix: use notes from context
const OverviewWrapper: React.FC = () => {
  return <Overview />;
};

export default OverviewWrapper;
