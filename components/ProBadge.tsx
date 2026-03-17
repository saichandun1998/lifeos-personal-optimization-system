import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ProBadgeProps {
  feature: string;
}

const ProBadge: React.FC<ProBadgeProps> = ({ feature }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        onClick={() => setShowTooltip(prev => !prev)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105"
        style={{
          background: 'rgba(240,160,48,0.12)',
          color: '#f0a030',
          border: '1px solid rgba(240,160,48,0.2)',
        }}
      >
        <span>{'\u2728'}</span>
        <span>PRO</span>
      </button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-3 rounded-xl z-50"
            style={{
              background: 'rgba(20,21,28,0.98)',
              border: '1px solid rgba(240,160,48,0.15)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px -4px rgba(0,0,0,0.5)',
            }}
          >
            <p className="text-xs text-white/60 leading-relaxed">
              Upgrade to Pro for <span className="text-amber-400 font-semibold">{feature}</span>.
            </p>
            <p className="text-[10px] text-white/25 mt-1">$9/month</p>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

export default ProBadge;
