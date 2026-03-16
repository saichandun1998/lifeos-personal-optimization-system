import React, { useState } from 'react';
import { DECISION_CATEGORIES, Icons } from '../constants';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'What to Eat': Icons.flame,
  'Next Task': Icons.target,
  'Break Activity': Icons.activity,
  'Workout Type': Icons.zap,
};

const DecisionMaker: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const handleCategoryChange = (i: number) => {
    if (spinning) return;
    setSelectedCat(i);
    setResult(null);
  };

  const decide = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const options = DECISION_CATEGORIES[selectedCat].options;
    let count = 0;
    const totalTicks = 22;

    const interval = setInterval(() => {
      setResult(options[Math.floor(Math.random() * options.length)]);
      count++;
      if (count >= totalTicks) {
        clearInterval(interval);
        // Land on a deterministic final pick
        setResult(options[Math.floor(Math.random() * options.length)]);
        setSpinning(false);
      }
    }, 55);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {DECISION_CATEGORIES.map((cat, i) => (
          <button
            key={i}
            onClick={() => handleCategoryChange(i)}
            className={'p-3 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all flex flex-col items-center gap-1.5 ' +
              (selectedCat === i
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:text-white/60')}
          >
            <span className="opacity-60">
              {CATEGORY_ICONS[cat.category] ?? Icons.shuffle}
            </span>
            {cat.category}
          </button>
        ))}
      </div>

      <div className="relative h-28 flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
        <div
          className={'absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent transition-opacity duration-200 ' +
            (spinning ? 'opacity-100' : 'opacity-0')}
        />
        {result ? (
          <div className="text-center space-y-2 z-10 relative">
            <span className="text-[9px] font-bold text-purple-400/60 uppercase tracking-[0.3em]">
              Recommendation
            </span>
            <div
              className={'text-lg font-bold text-white transition-all duration-100 ' +
                (spinning ? 'opacity-50 blur-[1px]' : 'opacity-100')}
            >
              {result}
            </div>
          </div>
        ) : (
          <div className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium text-center z-10 relative">
            Awaiting Directive
          </div>
        )}
      </div>

      <button
        onClick={decide}
        disabled={spinning}
        className={'w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-sm transition-all ' +
          (spinning
            ? 'bg-purple-900/20 text-white/30 cursor-not-allowed border border-purple-500/20'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.98] text-white')}
      >
        <span className={spinning ? 'animate-spin' : ''}>{Icons.shuffle}</span>
        {spinning ? 'Consulting Engine...' : 'Roll Decision'}
      </button>
    </div>
  );
};

export default DecisionMaker;
