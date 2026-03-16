import React, { useState } from 'react';
import { DECISION_CATEGORIES, Icons } from '../constants';
import { motion } from 'motion/react';

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
        setResult(options[Math.floor(Math.random() * options.length)]);
        setSpinning(false);
      }
    }, 55);
  };

  return (
    <div className="space-y-5">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {DECISION_CATEGORIES.map((cat, i) => (
          <button
            key={i}
            onClick={() => handleCategoryChange(i)}
            className={[
              'px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5',
              selectedCat === i
                ? 'bg-violet-500/12 border-violet-500/25 text-violet-400'
                : 'bg-white/[0.015] border-white/[0.04] text-white/25 hover:bg-white/[0.04] hover:text-white/40',
            ].join(' ')}
          >
            <span className="opacity-50">
              {CATEGORY_ICONS[cat.category] ?? Icons.shuffle}
            </span>
            {cat.category}
          </button>
        ))}
      </div>

      {/* Result display */}
      <div className="relative h-28 flex flex-col items-center justify-center rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.015)',
          border: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* Animated gradient on spin */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.08), transparent)',
            opacity: spinning ? 1 : 0,
          }}
        />

        {result ? (
          <div className="text-center space-y-1.5 z-10 relative">
            <span className="text-[9px] font-bold text-violet-400/50 uppercase tracking-[0.3em]">
              Recommendation
            </span>
            <motion.div
              key={result + String(spinning)}
              initial={!spinning ? { scale: 0.9, opacity: 0 } : false}
              animate={{ scale: 1, opacity: spinning ? 0.4 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-lg font-bold text-white"
              style={{ filter: spinning ? 'blur(1px)' : 'none' }}
            >
              {result}
            </motion.div>
          </div>
        ) : (
          <div className="text-[10px] text-white/12 uppercase tracking-[0.3em] font-medium text-center z-10">
            Awaiting Directive
          </div>
        )}
      </div>

      {/* Roll button */}
      <button
        onClick={decide}
        disabled={spinning}
        className={[
          'w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-sm transition-all',
          spinning
            ? 'bg-violet-500/8 text-white/25 cursor-not-allowed border border-violet-500/10'
            : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:shadow-violet-500/15 active:scale-[0.98] text-white',
        ].join(' ')}
      >
        <span className={spinning ? 'animate-spin' : ''}>{Icons.shuffle}</span>
        {spinning ? 'Consulting...' : 'Roll Decision'}
      </button>
    </div>
  );
};

export default DecisionMaker;
