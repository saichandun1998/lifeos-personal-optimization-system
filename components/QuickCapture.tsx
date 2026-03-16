import React, { useState } from 'react';
import { Icons } from '../constants';
import { Note } from '../types';

interface QuickCaptureProps {
  notes: Note[];
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
}

const QuickCapture: React.FC<QuickCaptureProps> = ({ notes, onAdd, onDelete }) => {
  const [text, setText] = useState('');

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      {/* Input row */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Capture a spark..."
          className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-yellow-400/60 placeholder:text-white/20 transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!text.trim()}
          aria-label="Add note"
          className="bg-yellow-400 text-black px-4 rounded-xl font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:bg-yellow-300"
        >
          +
        </button>
      </div>

      {/* Notes list */}
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <p className="text-center text-white/20 text-xs py-4 uppercase tracking-widest">No sparks captured yet</p>
        ) : (
          notes.map(n => (
            <div
              key={n.id}
              className="group flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
            >
              <span className="text-yellow-400 mt-0.5 flex-shrink-0">{Icons.lightbulb}</span>
              <div className="flex-grow min-w-0">
                <p className="text-sm text-white/80 break-words">{n.text}</p>
                <span className="text-[9px] text-white/20 font-bold">{n.time}</span>
              </div>
              <button
                onClick={() => onDelete(n.id)}
                aria-label="Delete note"
                className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity flex-shrink-0"
              >
                {Icons.trash}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuickCapture;
