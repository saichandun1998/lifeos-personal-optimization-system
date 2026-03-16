import React, { useState } from 'react';
import { ENERGY_CURVE, Icons } from '../constants';
import { formatHour } from '../utils';
import { Task, Priority } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface TaskSchedulerProps {
  tasks: Task[];
  onAdd: (name: string, hour: number, priority: Priority) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_COLORS: Record<Priority, { text: string; bg: string; border: string }> = {
  high: { text: 'text-red-400', bg: 'bg-red-400/8', border: 'border-red-400/15' },
  medium: { text: 'text-amber-400', bg: 'bg-amber-400/8', border: 'border-amber-400/15' },
  low: { text: 'text-blue-400', bg: 'bg-blue-400/8', border: 'border-blue-400/15' },
};

const TaskScheduler: React.FC<TaskSchedulerProps> = ({ tasks, onAdd, onToggle, onDelete }) => {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [hour, setHour] = useState(9);
  const [priority, setPriority] = useState<Priority>('medium');

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, hour, priority);
    setName('');
    setHour(9);
    setPriority('medium');
    setAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') { setAdding(false); setName(''); }
  };

  const sorted = [...tasks].sort((a, b) => a.hour - b.hour);

  return (
    <div className="space-y-4">
      {/* Task list */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {sorted.length === 0 && (
          <p className="text-center text-white/10 text-xs py-8 font-medium">No objectives scheduled</p>
        )}
        <AnimatePresence>
          {sorted.map((t, i) => {
            const curvePoint = ENERGY_CURVE.find(e => e.hour === t.hour);
            const energy = curvePoint?.energy ?? 50;
            const mismatch = t.priority === 'high' && energy < 60 && !t.done;
            const colors = PRIORITY_COLORS[t.priority];

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, height: 0 }}
                transition={{ delay: i * 0.03 }}
                className={[
                  'group flex items-center gap-3 p-3 rounded-xl border transition-all',
                  t.done
                    ? 'bg-white/[0.01] border-white/[0.03] opacity-45'
                    : 'bg-white/[0.015] border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.03]',
                ].join(' ')}
              >
                <button
                  onClick={() => onToggle(t.id)}
                  className={[
                    'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
                    t.done
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-white/12 hover:border-white/25',
                  ].join(' ')}
                >
                  {t.done && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-black scale-[0.55]"
                    >
                      {Icons.check}
                    </motion.span>
                  )}
                </button>

                <span className="text-[10px] font-bold text-white/20 w-14 uppercase flex-shrink-0 tabular-nums">
                  {formatHour(t.hour)}
                </span>

                <span className={'flex-grow text-sm truncate ' + (t.done ? 'line-through text-white/20' : 'text-white/80')}>
                  {t.name}
                </span>

                {mismatch && (
                  <span title="High-priority task during low-energy period" className="text-amber-400 text-xs animate-pulse flex-shrink-0">
                    ⚠
                  </span>
                )}

                <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border flex-shrink-0 ${colors.text} ${colors.bg} ${colors.border}`}>
                  {t.priority}
                </div>

                <button
                  onClick={() => onDelete(t.id)}
                  className="opacity-0 group-hover:opacity-25 hover:!opacity-70 transition-opacity flex-shrink-0"
                >
                  {Icons.trash}
                </button>
              </motion.div>
            );
          })}
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
            className="p-4 rounded-xl border border-white/[0.06] space-y-3"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Objective name..."
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500/40 outline-none placeholder:text-white/15 transition-colors"
            />
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <select
                value={hour}
                onChange={e => setHour(parseInt(e.target.value))}
                className="bg-white/[0.05] text-xs text-white/70 p-2.5 rounded-lg border border-white/[0.08] outline-none"
              >
                {Array.from({ length: 18 }, (_, i) => i + 5).map(h => (
                  <option key={h} value={h}>{formatHour(h)}</option>
                ))}
              </select>
              <div className="flex gap-1.5">
                {(['high', 'medium', 'low'] as Priority[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={[
                      'px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase border transition-all',
                      priority === p
                        ? 'bg-amber-500 text-black border-amber-500'
                        : 'border-white/[0.06] text-white/20 hover:border-white/[0.12]',
                    ].join(' ')}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setAdding(false); setName(''); }}
                className="flex-1 py-2.5 rounded-xl text-xs text-white/20 border border-white/[0.06] hover:bg-white/[0.03] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!name.trim()}
                className="flex-1 bg-amber-500 text-black py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-amber-500/15 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                Schedule
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setAdding(true)}
            className="w-full py-3 border border-dashed border-white/[0.06] rounded-xl text-white/20 text-sm hover:text-amber-400 hover:border-amber-500/30 transition-all"
          >
            + Add Objective
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskScheduler;
