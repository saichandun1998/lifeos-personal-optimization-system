import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Icons } from '../constants';

const FEATURES = [
  { icon: Icons.timer, title: 'Focus Timer', desc: 'Energy-aware Pomodoro sessions that adapt to your biology. Deep work when you peak, rest when you dip.', color: '#f0a030' },
  { icon: Icons.activity, title: 'Smart Scheduling', desc: 'Add a task, pick the priority — LifeOS auto-assigns it to your optimal energy window. No other app does this.', color: '#10B981' },
  { icon: Icons.flame, title: 'Habit Streaks', desc: 'Build atomic habits with daily tracking, streak counters, and automatic resets. Consistency over intensity.', color: '#EF4444' },
  { icon: Icons.target, title: 'Life Radar', desc: '360° view of your life balance across health, work, social, mind, wealth, and play. Spot blind spots instantly.', color: '#3B82F6' },
  { icon: Icons.journal, title: 'Daily Journal', desc: 'Capture sparks, reflect on your day with guided prompts, and track your mood over time.', color: '#8B5CF6' },
  { icon: Icons.zap, title: 'AI Coach (Coming Soon)', desc: 'Personalized daily insights powered by AI. "You complete 73% more tasks before noon — schedule hard work earlier."', color: '#EC4899' },
];

const STEPS = [
  { num: '01', title: 'Tell Us Your Tasks', desc: 'Add what you need to do today with a priority level. Takes 30 seconds.' },
  { num: '02', title: 'We Schedule Them', desc: 'LifeOS maps your tasks to your natural energy curve. High-priority work goes to peak hours automatically.' },
  { num: '03', title: 'Focus & Improve', desc: 'Use the energy-aware Focus Timer, track habits, journal daily. Watch your productivity transform.' },
];

const FREE_FEATURES = ['Energy scheduler', 'Habit tracking (5 habits)', 'Life radar', 'Quick notes', 'Decision engine', 'Local storage'];
const PRO_FEATURES = ['Everything in Free', 'AI-powered daily insights', 'Unlimited focus sessions', 'Adaptive timer duration', 'Cloud sync across devices', 'Data export & analytics'];

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ background: '#08090d' }}>
      {/* Background orbs */}
      <div className="bg-orb" style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(240,160,48,0.08), transparent)', top: -300, right: -200, animation: 'orb-1 25s ease-in-out infinite' }} />
      <div className="bg-orb" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(59,130,246,0.06), transparent)', bottom: -200, left: -200, animation: 'orb-2 30s ease-in-out infinite' }} />

      {/* ── Navbar ── */}
      <nav className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <span className="text-black">{Icons.zap}</span>
          </div>
          <span className="font-display text-sm font-bold text-white/80 tracking-wide">LifeOS</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/40 font-display font-medium">
          <a href="#features" className="hover:text-white/70 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white/70 transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-white/40 hover:text-white/70 font-medium transition-colors px-4 py-2">Log in</Link>
          <Link to="/login?signup=1" className="text-sm bg-white text-black font-bold px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors">Get Started Free</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="surface-elevated font-display inline-block mb-6 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest text-amber-400/80">
            Personal Optimization System
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] mb-8" style={{ letterSpacing: '-0.03em' }}>
            <span className="gradient-text">Your Life.</span>
            <br />
            <span className="text-white">Optimized.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            The command center that syncs your tasks with your natural energy. Track habits, balance your life, and make better decisions — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login?signup=1" className="group px-8 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-[0.98] animate-[glow-pulse_3s_ease-in-out_infinite]">
              Get Started Free
              <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
            <Link to="/app" className="shimmer px-8 py-5 text-white/40 font-semibold text-sm hover:text-white/60 transition-colors border border-white/[0.06] rounded-xl hover:border-white/[0.1]">
              Try Demo
            </Link>
          </div>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent rounded-3xl blur-2xl" />
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)' }}>
            <div className="p-1">
              {/* Fake browser chrome */}
              <div className="shimmer flex items-center gap-2 px-4 py-3 rounded-t-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
                <div className="ml-4 flex-grow h-6 rounded-md bg-white/[0.04] flex items-center px-3">
                  <span className="text-[10px] text-white/20 font-mono">lifeos.app/dashboard</span>
                </div>
              </div>
              {/* Fake dashboard */}
              <div className="p-6 flex gap-4 min-h-[250px]">
                {/* Sidebar mock */}
                <div className="hidden sm:flex flex-col gap-2 w-40 flex-shrink-0">
                  {['Dashboard', 'Focus', 'Schedule', 'Habits', 'Journal'].map((item, i) => (
                    <div key={i} className={'px-3 py-2 rounded-lg text-xs font-medium ' + (i === 0 ? 'bg-amber-500/10 text-amber-400' : 'text-white/15')}>
                      {item}
                    </div>
                  ))}
                </div>
                {/* Content mock */}
                <div className="flex-grow space-y-4">
                  <div className="flex gap-3">
                    {['#F59E0B', '#3B82F6', '#10B981'].map((c, i) => (
                      <div key={i} className="flex-1 h-16 rounded-xl border border-white/[0.04]" style={{ background: c + '08' }}>
                        <div className="p-3">
                          <div className="w-8 h-1.5 rounded bg-white/[0.06] mb-2" />
                          <div className="text-lg font-bold" style={{ color: c + '80' }}>{['72%', '58%', '85%'][i]}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-24 rounded-xl border border-white/[0.04] bg-white/[0.01] p-4">
                    <svg viewBox="0 0 400 60" className="w-full h-full">
                      <path d="M 0 50 C 50 45, 80 20, 120 15 C 160 10, 180 8, 220 25 C 260 42, 280 30, 320 20 C 360 10, 380 35, 400 40" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.4" />
                      <path d="M 0 50 C 50 45, 80 20, 120 15 C 160 10, 180 8, 220 25 C 260 42, 280 30, 320 20 C 360 10, 380 35, 400 40 L 400 60 L 0 60 Z" fill="url(#hero-grad)" />
                      <defs><linearGradient id="hero-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F59E0B" stopOpacity="0.1" /><stop offset="100%" stopColor="#F59E0B" stopOpacity="0" /></linearGradient></defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-amber-500/5 blur-3xl rounded-full" />
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4">Everything you need to operate at peak.</h2>
          <p className="text-white/30 max-w-xl mx-auto font-medium">Six integrated tools that work together to optimize how you spend your energy, time, and attention.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="group surface p-6 rounded-2xl hover:border-white/[0.08] transition-all"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: f.color + '12', color: f.color }}>
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-white/85 mb-2 tracking-wide">{f.title}</h3>
              <p className="text-xs text-white/30 leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── What Makes Us Different ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-6" style={{ letterSpacing: '-0.03em' }}>
              Other apps ask<br /><span className="text-white/30">what</span> to do.<br />
              LifeOS tells you<br /><span className="gradient-text">when</span> to do it.
            </h2>
            <p className="text-white/35 font-medium leading-relaxed">
              Todoist doesn't know your energy. Google Calendar doesn't care when you peak. LifeOS is the only productivity system that schedules your work around your biology — so you get more done with less effort.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Peak Performance', time: '9 — 11 AM', energy: 95, desc: 'Deep work, strategy, writing' },
              { label: 'Post-Lunch Dip', time: '1 — 3 PM', energy: 55, desc: 'Admin, emails, light tasks' },
              { label: 'Second Wind', time: '3 — 5 PM', energy: 75, desc: 'Collaboration, creative work' },
            ].map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.04]"
                style={{ background: 'rgba(255,255,255,0.015)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${block.energy > 80 ? '16,185,129' : block.energy > 60 ? '240,160,48' : '239,68,68'},0.1)` }}>
                  <span className="text-lg font-display font-bold" style={{ color: block.energy > 80 ? '#10B981' : block.energy > 60 ? '#f0a030' : '#EF4444' }}>{block.energy}%</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-display font-bold text-white/80">{block.label}</span>
                    <span className="text-[10px] text-white/20 font-medium">{block.time}</span>
                  </div>
                  <p className="text-xs text-white/30 font-medium">{block.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4">Three steps to a better day.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="font-display text-7xl font-bold mb-4" style={{ color: 'rgba(240, 160, 48, 0.12)' }}>{s.num}</div>
              <h3 className="font-display text-sm font-bold text-white/80 mb-2 uppercase tracking-wider">{s.title}</h3>
              <p className="text-xs text-white/30 leading-relaxed font-medium">{s.desc}</p>
              {i < 2 && <div className="hidden md:block absolute" />}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4">Simple, honest pricing.</h2>
          <p className="text-white/30 font-medium">Start free. Upgrade when you need cloud sync.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="p-8 rounded-2xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="font-display text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Free</div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-display text-5xl font-bold text-white">$0</span>
              <span className="text-white/20 text-sm font-medium">/ forever</span>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/50 font-medium">
                  <span className="text-emerald-400 flex-shrink-0">{Icons.check}</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/login?signup=1" className="block text-center py-3 rounded-xl border border-white/[0.08] text-white/50 font-bold text-sm hover:bg-white/[0.04] hover:text-white/70 transition-all">
              Get Started
            </Link>
          </div>
          {/* Pro */}
          <div className="surface-elevated relative p-8 rounded-2xl border border-amber-500/10 overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold bg-amber-500 text-black rounded-bl-lg uppercase tracking-wider">Popular</div>
            <div className="font-display text-xs font-bold text-amber-400/60 uppercase tracking-widest mb-2">Pro</div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-display text-5xl font-bold text-white">$9</span>
              <span className="text-white/20 text-sm font-medium">/ month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/50 font-medium">
                  <span className="text-amber-400 flex-shrink-0">{Icons.check}</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/login?signup=1" className="block text-center py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:shadow-lg hover:shadow-amber-500/20 transition-all">
              Start Pro Trial
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="surface-elevated p-12 rounded-3xl"
          style={{ background: 'linear-gradient(135deg, rgba(240,160,48,0.04), rgba(59,130,246,0.04))' }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to optimize?</h2>
          <p className="text-white/30 mb-8 font-medium">Start free. No credit card required.</p>
          <Link to="/login?signup=1" className="inline-block px-10 py-4 bg-white text-black font-bold rounded-xl text-sm hover:bg-white/90 transition-all active:scale-[0.98]">
            Get Started Now &rarr;
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent mb-12" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <span className="text-black scale-75">{Icons.zap}</span>
            </div>
            <span className="text-xs font-bold text-white/30">LifeOS</span>
          </div>
          <p className="text-[11px] text-white/15 font-medium">&copy; 2026 LifeOS. Built for peak performance.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
