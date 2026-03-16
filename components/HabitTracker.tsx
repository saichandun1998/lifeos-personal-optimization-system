import React, { useState } from 'react';
import { Icons } from '../constants';
import { Habit } from '../types';

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
  const progress = habits.length > 0 ? (doneCount / habits.length) * 100 : 0;

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
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-white/40 uppercase tracking-wider w-16 flex-shrink-0">
          {doneCount}/{habits.length} Done
        </span>
        <div className="flex-grow h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 transition-all duration-500"
            style={{ width: progress + '%' }}
          />
        </div>
      </div>

      {/* Habit list */}
      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
        {habits.length === 0 && (
          <p className="text-center text-white/20 text-xs py-4 uppercase tracking-widest">No habits yet</p>
        )}
        {habits.map(h => (
          <div
            key={h.id}
            className={'group flex items-center gap-3 p-3 rounded-xl border transition-all ' +
              (h.done ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/5 hover:border-white/10')}
          >
            <button
              onClick={() => onToggle(h.id)}
              aria-label={h.done ? 'Unmark habit' : 'Mark habit complete'}
              className={'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ' +
                (h.done ? 'bg-green-500 border-green-500' : 'border-white/20 hover:border-white/40')}
            >
              {h.done && <span className="text-black scale-75">{Icons.check}</span>}
            </button>
            <span className="text-lg flex-shrink-0">{h.emoji}</span>
            <span className={'flex-grow text-sm ' + (h.done ? 'text-white/40 line-through' : 'text-white/90')}>
              {h.name}
            </span>
            {h.streak > 0 && (
              <div className="text-[9px] text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full flex-shrink-0 tabular-nums">
                {h.streak}d
              </div>
            )}
            <button
              onClick={() => onDelete(h.id)}
              aria-label="Delete habit"
              className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity flex-shrink-0"
            >
              {Icons.trash}
            </button>
          </div>
        ))}
      </div>

      {/* Add form */}
      {adding ? (
        <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-3">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Habit name..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-orange-500 placeholder:text-white/20"
          />
          <div className="flex flex-wrap gap-1.5">
            {EMOJI_OPTIONS.map(em => (
              <button
                key={em}
                onClick={() => setNewEmoji(em)}
                className={'text-lg p-1 rounded-lg transition-all ' +
                  (newEmoji === em ? 'bg-orange-500/20 ring-1 ring-orange-500/50' : 'hover:bg-white/10')}
              >
                {em}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setAdding(false); setNewName(''); }}
              className="flex-1 py-2 rounded-lg text-xs text-white/30 border border-white/10 hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              Add Habit
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-white/30 text-sm hover:text-orange-400 hover:border-orange-500/50 transition-all"
        >
          + Add Habit
        </button>
      )}
    </div>
  );
};

export default HabitTracker;
