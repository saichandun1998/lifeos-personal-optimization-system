import React, { useState } from 'react';
import { Icons } from '../constants';
import { Note } from '../types';
import { motion, AnimatePresence } from 'motion/react';

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
      {/* Input */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Capture a spark..."
          className="flex-grow bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/40 placeholder:text-white/12 transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!text.trim()}
          className="bg-amber-500 text-black w-10 rounded-xl font-bold text-lg disabled:opacity-25 disabled:cursor-not-allowed transition-opacity hover:bg-amber-400 flex items-center justify-center flex-shrink-0"
        >
          +
        </button>
      </div>

      {/* Notes */}
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <p className="text-center text-white/10 text-xs py-6 font-medium">No sparks captured yet</p>
        ) : (
          <AnimatePresence>
            {notes.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group flex items-start gap-3 p-3 rounded-xl border border-white/[0.03] bg-white/[0.015] hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-amber-400/60 mt-0.5 flex-shrink-0">{Icons.lightbulb}</span>
                <div className="flex-grow min-w-0">
                  <p className="text-sm text-white/70 break-words leading-relaxed">{n.text}</p>
                  <span className="text-[9px] text-white/15 font-semibold">{n.time}</span>
                </div>
                <button
                  onClick={() => onDelete(n.id)}
                  className="opacity-0 group-hover:opacity-25 hover:!opacity-70 transition-opacity flex-shrink-0 mt-0.5"
                >
                  {Icons.trash}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default QuickCapture;
