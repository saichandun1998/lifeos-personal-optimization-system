import React, { useState } from 'react';
import { Icons } from '../constants';

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accentColor?: string;
  /** When true the card starts collapsed. Default: false. */
  defaultCollapsed?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  icon,
  children,
  accentColor = '#ff9500',
  defaultCollapsed = false,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300">
      <button
        onClick={() => setCollapsed(c => !c)}
        aria-expanded={!collapsed}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
      >
        <span style={{ color: accentColor }} className="flex-shrink-0">{icon}</span>
        <span className="text-sm font-semibold text-white/90 flex-grow text-left">{title}</span>
        <span
          className={'transform transition-transform duration-200 text-white/30 ' + (collapsed ? '-rotate-90' : 'rotate-0')}
        >
          {Icons.chevDown}
        </span>
      </button>
      {!collapsed && (
        <div className="p-4 pt-0 border-t border-white/5">
          {children}
        </div>
      )}
    </div>
  );
};

export default Card;
