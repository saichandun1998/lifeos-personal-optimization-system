import React, { useState } from 'react';
import { Icons } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accentColor?: string;
  defaultCollapsed?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  icon,
  children,
  accentColor = '#F59E0B',
  defaultCollapsed = false,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="card-glow relative rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        '--glow-color': accentColor + '18',
      } as React.CSSProperties}
    >
      {/* Accent top line */}
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(90deg, ${accentColor}80, ${accentColor}20, transparent)`,
        }}
      />

      <button
        onClick={() => setCollapsed(c => !c)}
        aria-expanded={!collapsed}
        className="w-full flex items-center gap-3 p-5 hover:bg-white/[0.02] transition-colors"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: accentColor + '12',
            color: accentColor,
          }}
        >
          {icon}
        </div>
        <span className="text-sm font-semibold text-white/85 flex-grow text-left tracking-wide">
          {title}
        </span>
        <motion.span
          animate={{ rotate: collapsed ? -90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/15"
        >
          {Icons.chevDown}
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Card;
