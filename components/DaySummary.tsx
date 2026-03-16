import React, { useMemo } from 'react';
import { ENERGY_CURVE } from '../constants';
import { Task } from '../types';
import { formatHour } from '../utils';
import { motion } from 'motion/react';

interface DaySummaryProps {
  tasks: Task[];
  currentEnergy: { energy: number; label: string };
}

function getEnergyColor(energy: number): string {
  if (energy >= 75) return '#10B981';
  if (energy >= 50) return '#f0a030';
  if (energy >= 30) return '#F97316';
  return '#EF4444';
}

const DaySummary: React.FC<DaySummaryProps> = ({ tasks, currentEnergy }) => {
  const doneCount = tasks.filter(t => t.done).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? doneCount / totalCount : 0;

  // SVG donut ring
  const ringSize = 48;
  const strokeW = 4;
  const r = (ringSize - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - progress * circ;

  const energyColor = getEnergyColor(currentEnergy.energy);

  // Calculate best remaining hours from ENERGY_CURVE
  const bestHours = useMemo(() => {
    const now = new Date().getHours();
    const future = ENERGY_CURVE
      .filter(p => p.hour > now && p.hour <= 22)
      .sort((a, b) => b.energy - a.energy)
      .slice(0, 3);
    return future;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Header */}
      <h3 className="font-display text-xs font-bold text-white/30 uppercase tracking-[0.2em]">
        Day Summary
      </h3>

      {/* Completion donut + task count */}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0" style={{ width: ringSize, height: ringSize }}>
          <svg width={ringSize} height={ringSize} className="-rotate-90">
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={strokeW}
            />
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={r}
              fill="none"
              stroke={progress === 1 && totalCount > 0 ? '#10B981' : '#f0a030'}
              strokeWidth={strokeW}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white/60 tabular-nums">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-white/70">
            {doneCount}/{totalCount} tasks done
          </div>
          <div className="text-[10px] text-white/20 font-medium">
            {totalCount === 0
              ? 'No tasks scheduled'
              : progress === 1
                ? 'All complete!'
                : `${totalCount - doneCount} remaining`}
          </div>
        </div>
      </div>

      {/* Current energy */}
      <div className="flex items-center gap-3">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{
            background: energyColor,
            boxShadow: `0 0 8px ${energyColor}60`,
          }}
        />
        <div className="flex-grow">
          <div className="text-xs text-white/50">
            <span className="font-bold tabular-nums" style={{ color: energyColor }}>
              {currentEnergy.energy}%
            </span>
            <span className="mx-1.5 text-white/10">—</span>
            {currentEnergy.label}
          </div>
        </div>
      </div>

      {/* Energy bar */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: currentEnergy.energy + '%' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: energyColor }}
        />
      </div>

      {/* Best remaining hours */}
      {bestHours.length > 0 && (
        <div>
          <div className="text-[10px] text-white/20 font-semibold uppercase tracking-[0.15em] mb-2">
            Best remaining hours
          </div>
          <div className="flex gap-2">
            {bestHours.map(point => (
              <div
                key={point.hour}
                className="flex-1 rounded-lg px-2.5 py-2 text-center"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div className="text-xs font-bold text-white/60 tabular-nums">
                  {formatHour(point.hour)}
                </div>
                <div
                  className="text-[10px] font-semibold tabular-nums mt-0.5"
                  style={{ color: getEnergyColor(point.energy) }}
                >
                  {point.energy}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DaySummary;
