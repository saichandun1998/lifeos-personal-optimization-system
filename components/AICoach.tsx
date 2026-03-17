import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { askGemini, buildInsightPrompt, isGeminiConfigured } from '../src/lib/gemini';
import { Habit, Task, LifeScores, FocusSession } from '../types';
import { getCurrentEnergy, getGreeting, todayKey, loadFromStorage, saveToStorage } from '../utils';

interface AICoachProps {
  habits: Habit[];
  tasks: Task[];
  lifeScores: LifeScores;
  focusSessions: FocusSession[];
}

interface CachedInsight {
  text: string;
  date: string;
  timestamp: number;
}

const CACHE_KEY = 'lifeos_ai_insight';
const CACHE_TTL = 3 * 60 * 60 * 1000; // 3 hours

const AICoach: React.FC<AICoachProps> = ({ habits, tasks, lifeScores, focusSessions }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todaySessions = focusSessions.filter(s => s.startedAt.startsWith(todayKey()));
  const focusMins = todaySessions.reduce((sum, s) => sum + s.duration, 0);

  const getInsight = useCallback(async (force = false) => {
    // Check cache first (unless forced refresh)
    if (!force) {
      const cached = loadFromStorage<CachedInsight | null>(CACHE_KEY, null);
      if (cached && cached.date === todayKey() && Date.now() - cached.timestamp < CACHE_TTL) {
        setInsight(cached.text);
        return;
      }
    }

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
      // Cache the result
      saveToStorage<CachedInsight>(CACHE_KEY, {
        text: result,
        date: todayKey(),
        timestamp: Date.now(),
      });
    } catch (e: any) {
      setError(e.message || 'Failed to get insights');
    }
    setLoading(false);
  }, [habits, tasks, lifeScores, focusMins, todaySessions.length]);

  // Auto-load on mount (uses cache if available)
  useEffect(() => {
    if (isGeminiConfigured) {
      getInsight(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isGeminiConfigured) return null;

  // Parse insight into structured lines
  const insightLines = insight
    ? insight.split('\n').filter(l => l.trim().length > 0)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative rounded-2xl border overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(236,72,153,0.03), rgba(139,92,246,0.03), rgba(59,130,246,0.03))',
        borderColor: 'rgba(139,92,246,0.1)',
      }}
    >
      {/* Top accent line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, #EC4899, #8B5CF6, #3B82F6)' }} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(139,92,246,0.15))' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="url(#coach-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id="coach-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              {insight && (
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2" style={{ borderColor: '#08090d' }} />
              )}
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white/90">AI Coach</h3>
              <p className="text-[10px] text-white/25 font-medium">
                {loading ? 'Analyzing your patterns...' : insight ? 'Updated just now' : 'Ready to analyze'}
              </p>
            </div>
          </div>

          <button
            onClick={() => getInsight(true)}
            disabled={loading}
            className="group px-4 py-2 rounded-lg text-[11px] font-bold tracking-wider transition-all disabled:opacity-40 flex items-center gap-2"
            style={{
              background: 'rgba(139,92,246,0.08)',
              color: '#a78bfa',
              border: '1px solid rgba(139,92,246,0.12)',
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.2" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                Thinking...
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-180 transition-transform duration-300"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                {insight ? 'Refresh' : 'Analyze'}
              </>
            )}
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 rounded-xl text-xs font-medium"
              style={{ background: 'rgba(239,68,68,0.06)', color: 'rgba(239,68,68,0.7)', border: '1px solid rgba(239,68,68,0.1)' }}
            >
              {error}
            </motion.div>
          )}

          {loading && !insight && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full shimmer flex-shrink-0" style={{ background: 'rgba(139,92,246,0.06)' }} />
                  <div className="flex-grow space-y-1.5">
                    <div className="h-3 rounded shimmer" style={{ width: `${70 + i * 10}%`, background: 'rgba(255,255,255,0.03)' }} />
                    <div className="h-3 rounded shimmer" style={{ width: `${40 + i * 15}%`, background: 'rgba(255,255,255,0.02)' }} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {insightLines.length > 0 && !error && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              {insightLines.map((line, i) => {
                const cleaned = line.replace(/^[\s*•\-]+/, '').trim();
                if (!cleaned) return null;

                // Try to split on bold markdown (**label**)
                const boldMatch = cleaned.match(/^\*\*(.+?)\*\*[\s:—\-]*(.*)/);
                const label = boldMatch ? boldMatch[1] : null;
                const body = boldMatch ? boldMatch[2] : cleaned;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3 items-start p-3 rounded-xl transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{
                      background: i === 0 ? '#EC4899' : i === 1 ? '#8B5CF6' : '#3B82F6',
                    }} />
                    <div className="text-sm leading-relaxed">
                      {label && <span className="font-display font-bold text-white/80">{label} </span>}
                      <span className="text-white/45 font-medium">{body}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {!insight && !error && !loading && (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-white/15 font-medium text-center py-4"
            >
              Your personal AI coach is ready. Click "Analyze" to get started.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AICoach;
