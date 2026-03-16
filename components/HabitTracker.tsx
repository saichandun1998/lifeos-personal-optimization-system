import React, { useState } from 'react';
import { Icons } from '../constants';
import { Habit } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HabitTrackerProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onAdd: (name: string, emoji: string) => void;
  onDelete: (id: string) => void;
}

const EMOJI_OPTIONS = ['✨', '🌅', '💻', '✍️', '🏃', '🧘', '📚', '💧', '🥗', '🎯', '🛌', '🎨'];

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggle, onAdd, onDelete }) => {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('✨');

  const doneCount = habits.filter(h => h.done).length;
  const progress = habits.length > 0 ? doneCount / habits.length : 0;

  // SVG ring values
  const ringSize = 56;
  const strokeW = 4;
  const r = (ringSize - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - progress * circ;

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAdd(trimmed, newEmoji);
    setNewName('');
    setNewEmoji('✨');
    setAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') { setAdding(false); setNewName(''); }
  };

  return (
    <div className="space-y-5">
      {/* Progress ring */}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0" style={{ width: ringSize, height: ringSize }}>
          <svg width={ringSize} height={ringSize} className="-rotate-90">
            <circle
              cx={ringSize / 2} cy={ringSize / 2} r={r}
              fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeW}
            />
            <circle
              cx={ringSize / 2} cy={ringSize / 2} r={r}
              fill="none" stroke="#10B981" strokeWidth={strokeW}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white/70 tabular-nums">{doneCount}/{habits.length}</span>
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-white/50">Today's Habits</div>
          <div className="text-[10px] text-white/20 font-medium">
            {progress === 1 && habits.length > 0
              ? 'All complete!'
              : `${Math.round(progress * 100)}% done`}
          </div>
        </div>
      </div>

      {/* Habit list */}
      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
        {habits.length === 0 && (
          <p className="text-center text-white/12 text-xs py-6 font-medium">No habits yet — add one below</p>
        )}
        <AnimatePresence>
          {habits.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16, height: 0 }}
              transition={{ delay: i * 0.04 }}
              className={[
                'group flex items-center gap-3 p-3 rounded-xl border transition-all',
                h.done
                  ? 'bg-emerald-500/[0.04] border-emerald-500/10'
                  : 'bg-white/[0.015] border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.03]',
              ].join(' ')}
            >
              <button
                onClick={() => onToggle(h.id)}
                className={[
                  'w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all',
                  h.done
                    ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'border-white/12 hover:border-white/25',
                ].join(' ')}
              >
                {h.done && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className="text-black scale-75"
                  >
                    {Icons.check}
                  </motion.span>
                )}
              </button>
              <span className="text-lg flex-shrink-0">{h.emoji}</span>
              <span className={'flex-grow text-sm ' + (h.done ? 'text-white/25 line-through' : 'text-white/75')}>
                {h.name}
              </span>
              {h.streak > 0 && (
                <div className="text-[10px] text-amber-400 bg-amber-400/8 px-2.5 py-1 rounded-full flex-shrink-0 tabular-nums font-semibold">
                  🔥 {h.streak}
                </div>
              )}
              <button
                onClick={() => onDelete(h.id)}
                className="opacity-0 group-hover:opacity-25 hover:!opacity-70 transition-opacity flex-shrink-0"
              >
                {Icons.trash}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add form */}
      <AnimatePresence mode="wait">
        {adding ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.06] space-y-3"
          >
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Habit name..."
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 placeholder:text-white/15 transition-colors"
            />
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_OPTIONS.map(em => (
                <button
                  key={em}
                  onClick={() => setNewEmoji(em)}
                  className={[
                    'text-lg p-1.5 rounded-lg transition-all',
                    newEmoji === em
                      ? 'bg-emerald-500/15 ring-1 ring-emerald-500/40 scale-110'
                      : 'hover:bg-white/[0.06]',
                  ].join(' ')}
                >
                  {em}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setAdding(false); setNewName(''); }}
                className="flex-1 py-2.5 rounded-lg text-xs text-white/25 border border-white/[0.06] hover:bg-white/[0.03] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="flex-1 bg-emerald-500 text-white py-2.5 rounded-lg text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-opacity shadow-lg shadow-emerald-500/15"
              >
                Add Habit
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setAdding(true)}
            className="w-full py-3 border border-dashed border-white/[0.06] rounded-xl text-white/20 text-sm hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
          >
            + Add Habit
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HabitTracker;
