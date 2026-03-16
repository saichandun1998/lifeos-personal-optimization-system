import React, { useState, useMemo } from 'react';
import { DAILY_PROMPTS } from '../constants';
import { DailyReflection as DailyReflectionType } from '../types';
import { todayKey, generateId } from '../utils';
import { motion, AnimatePresence } from 'motion/react';

interface DailyReflectionProps {
  reflections: DailyReflectionType[];
  onAdd: (reflection: DailyReflectionType) => void;
}

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getRatingColor(rating: number): string {
  if (rating >= 8) return '#10B981';
  if (rating >= 6) return '#f0a030';
  if (rating >= 4) return '#F97316';
  return '#EF4444';
}

const DailyReflection: React.FC<DailyReflectionProps> = ({ reflections, onAdd }) => {
  const today = todayKey();
  const todayReflection = reflections.find(r => r.date === today);

  const [rating, setRating] = useState(5);
  const [word, setWord] = useState('');

  const dailyPrompt = useMemo(() => {
    const dayOfYear = getDayOfYear();
    return DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length];
  }, []);

  const handleSave = () => {
    const trimmed = word.trim();
    if (!trimmed) return;
    const reflection: DailyReflectionType = {
      id: generateId(),
      date: today,
      rating,
      word: trimmed,
    };
    onAdd(reflection);
    setWord('');
    setRating(5);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
  };

  const ratingColor = getRatingColor(todayReflection ? todayReflection.rating : rating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl p-5 space-y-5"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Daily prompt */}
      <div className="space-y-2">
        <div className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">
          Today's Prompt
        </div>
        <p className="text-sm text-white/50 italic leading-relaxed font-display">
          "{dailyPrompt}"
        </p>
      </div>

      <AnimatePresence mode="wait">
        {todayReflection ? (
          /* Saved reflection display */
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div
              className="rounded-xl p-4"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div className="flex items-center gap-4">
                {/* Rating circle */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: getRatingColor(todayReflection.rating) + '12',
                    border: `2px solid ${getRatingColor(todayReflection.rating)}30`,
                  }}
                >
                  <span
                    className="text-xl font-bold font-display tabular-nums"
                    style={{ color: getRatingColor(todayReflection.rating) }}
                  >
                    {todayReflection.rating}
                  </span>
                </div>
                <div className="flex-grow">
                  <div className="text-[10px] text-white/20 font-semibold uppercase tracking-[0.15em] mb-1">
                    Today in one word
                  </div>
                  <div className="text-lg font-bold text-white/70 font-display">
                    {todayReflection.word}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-white/15 text-center font-medium uppercase tracking-[0.15em]">
              Reflection saved for today
            </p>
          </motion.div>
        ) : (
          /* Reflection form */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            {/* Rating slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-[0.15em]">
                  Rate your day
                </span>
                <span
                  className="text-lg font-bold font-display tabular-nums"
                  style={{ color: ratingColor }}
                >
                  {rating}
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={rating}
                  onChange={e => setRating(parseInt(e.target.value))}
                  className="w-full"
                />
                {/* Scale markers */}
                <div className="flex justify-between px-0.5 mt-1">
                  {Array.from({ length: 10 }, (_, i) => (
                    <span
                      key={i}
                      className="text-[8px] tabular-nums"
                      style={{
                        color: i + 1 === rating ? ratingColor : 'rgba(255,255,255,0.1)',
                        fontWeight: i + 1 === rating ? 700 : 400,
                      }}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Word input */}
            <div className="space-y-2">
              <label className="text-[10px] text-white/20 font-bold uppercase tracking-[0.15em]">
                One word to describe today
              </label>
              <input
                type="text"
                value={word}
                onChange={e => setWord(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. productive, restful, chaotic..."
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/50 placeholder:text-white/15 transition-colors"
              />
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={!word.trim()}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-lg shadow-amber-500/10"
              style={{
                background: word.trim()
                  ? 'linear-gradient(135deg, #f0a030, #e08a20)'
                  : 'rgba(255,255,255,0.03)',
              }}
            >
              Save Reflection
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DailyReflection;
