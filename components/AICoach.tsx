import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icons } from '../constants';
import { askGemini, buildInsightPrompt, isGeminiConfigured } from '../src/lib/gemini';
import { Habit, Task, LifeScores, FocusSession } from '../types';
import { getCurrentEnergy, getGreeting, todayKey } from '../utils';

interface AICoachProps {
  habits: Habit[];
  tasks: Task[];
  lifeScores: LifeScores;
  focusSessions: FocusSession[];
}

const AICoach: React.FC<AICoachProps> = ({ habits, tasks, lifeScores, focusSessions }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todaySessions = focusSessions.filter(s => s.startedAt.startsWith(todayKey()));
  const focusMins = todaySessions.reduce((sum, s) => sum + s.duration, 0);

  const getInsight = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = buildInsightPrompt({
        habits: habits.map(h => ({ name: h.name, streak: h.streak, done: h.done })),
        tasks: tasks.map(t => ({ name: t.name, hour: t.hour, priority: t.priority, done: t.done })),
        lifeScores,
        focusMinutes: focusMins,
        focusSessions: todaySessions.length,
        currentEnergy: getCurrentEnergy().energy,
        greeting: getGreeting(),
      });
      const result = await askGemini(prompt);
      setInsight(result);
    } catch (e: any) {
      setError(e.message || 'Failed to get insights');
    }
    setLoading(false);
  }, [habits, tasks, lifeScores, focusMins, todaySessions.length]);

  if (!isGeminiConfigured) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative p-6 rounded-2xl border overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(236,72,153,0.04), rgba(139,92,246,0.04))',
        borderColor: 'rgba(236,72,153,0.12)',
      }}
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-20 blur-3xl" style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)' }} />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.12)' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4c0 1.1-.3 2.1-.8 3l6.3 6.3a1 1 0 0 1 0 1.4l-2.8 2.8a1 1 0 0 1-1.4 0L11 13.2c-.9.5-1.9.8-3 .8a4 4 0 1 1 0-8" />
                <circle cx="8" cy="6" r="1" fill="#EC4899" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white/85">AI Coach</h3>
              <p className="text-[10px] text-white/25 font-medium">Personalized insights from your data</p>
            </div>
          </div>

          <button
            onClick={getInsight}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-40"
            style={{
              background: loading ? 'rgba(236,72,153,0.08)' : 'rgba(236,72,153,0.12)',
              color: '#EC4899',
              border: '1px solid rgba(236,72,153,0.15)',
            }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.2" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                Analyzing...
              </span>
            ) : insight ? 'Refresh' : 'Get Insights'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-red-400/70 font-medium"
            >
              {error}
            </motion.p>
          )}

          {insight && !error && (
            <motion.div
              key="insight"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-sm text-white/60 leading-relaxed font-medium space-y-2 whitespace-pre-line"
            >
              {insight.split('\n').filter(Boolean).map((line, i) => (
                <p key={i} className={line.startsWith('*') || line.startsWith('-') || line.startsWith('\u2022') ? 'pl-0' : ''}>
                  {line}
                </p>
              ))}
            </motion.div>
          )}

          {!insight && !error && !loading && (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-white/20 font-medium"
            >
              Click "Get Insights" to receive AI-powered analysis of your habits, tasks, energy patterns, and life balance.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AICoach;
