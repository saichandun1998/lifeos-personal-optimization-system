import React, { useState } from 'react';
import { ENERGY_CURVE, Icons } from '../constants';
import { formatHour } from '../utils';
import { Task, Priority } from '../types';

interface TaskSchedulerProps {
  tasks: Task[];
  onAdd: (name: string, hour: number, priority: Priority) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_STYLES: Record<Priority, string> = {
  high: 'text-red-400 bg-red-400/10 border-red-400/20',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  low: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
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
          <p className="text-center text-white/20 text-xs py-6 uppercase tracking-widest">No objectives scheduled</p>
        )}
        {sorted.map(t => {
          const curvePoint = ENERGY_CURVE.find(e => e.hour === t.hour);
          const energy = curvePoint?.energy ?? 50;
          const mismatch = t.priority === 'high' && energy < 60 && !t.done;
          return (
            <div
              key={t.id}
              className={'group flex items-center gap-3 p-3 rounded-xl border transition-all ' +
                (t.done ? 'bg-white/3 border-white/5 opacity-50' : 'bg-white/5 border-white/5 hover:border-white/10')}
            >
              <button
                onClick={() => onToggle(t.id)}
                aria-label={t.done ? 'Mark incomplete' : 'Mark complete'}
                className={'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ' +
                  (t.done ? 'bg-green-500 border-green-500' : 'border-white/20 hover:border-white/40')}
              >
                {t.done && <span className="text-black scale-[0.6]">{Icons.check}</span>}
              </button>
              <span className="text-[10px] font-bold text-white/30 w-14 uppercase flex-shrink-0">
                {formatHour(t.hour)}
              </span>
              <span className={'flex-grow text-sm truncate ' + (t.done ? 'line-through text-white/30' : 'text-white')}>
                {t.name}
              </span>
              {mismatch && (
                <span
                  title="High-priority task during low-energy period"
                  className="text-orange-400 text-xs animate-pulse flex-shrink-0"
                >
                  ⚠
                </span>
              )}
              <div className={'px-2 py-0.5 rounded text-[8px] font-bold uppercase border flex-shrink-0 ' + PRIORITY_STYLES[t.priority]}>
                {t.priority}
              </div>
              <button
                onClick={() => onDelete(t.id)}
                aria-label="Delete task"
                className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity flex-shrink-0"
              >
                {Icons.trash}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add form */}
      {adding ? (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Objective name..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none placeholder:text-white/20"
          />
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <select
              value={hour}
              onChange={e => setHour(parseInt(e.target.value))}
              className="bg-[#111] text-xs text-white p-2 rounded-lg border border-white/10 outline-none"
            >
              {Array.from({ length: 18 }, (_, i) => i + 5).map(h => (
                <option key={h} value={h}>{formatHour(h)}</option>
              ))}
            </select>
            <div className="flex gap-1">
              {(['high', 'medium', 'low'] as Priority[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={'px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase border transition-all ' +
                    (priority === p ? 'bg-orange-500 text-white border-orange-500' : 'border-white/10 text-white/30 hover:border-white/20')}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setAdding(false); setName(''); }}
              className="flex-1 py-2.5 rounded-xl text-xs text-white/30 border border-white/10 hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!name.trim()}
              className="flex-1 bg-orange-500 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              Schedule Slot
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-white/30 text-sm hover:text-orange-400 hover:border-orange-500/50 transition-all"
        >
          + Add Objective
        </button>
      )}
    </div>
  );
};

export default TaskScheduler;
