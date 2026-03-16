import React, { useMemo } from 'react';
import { ENERGY_CURVE } from '../constants';
import { getCurrentEnergy } from '../utils';
import { Task } from '../types';

interface EnergyCurveProps {
  tasks: Task[];
}

const PRIORITY_COLORS: Record<string, string> = {
  high: '#EF4444',
  medium: '#EAB308',
  low: '#3B82F6',
};

const W = 800;
const H = 200;
const PAD = { top: 28, right: 25, bottom: 28, left: 25 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;

function toX(hour: number): number {
  return PAD.left + ((hour - 5) / 17) * CHART_W;
}

function toY(energy: number): number {
  return PAD.top + CHART_H - (energy / 100) * CHART_H;
}

function interpolateEnergy(hour: number): number {
  const sorted = [...ENERGY_CURVE].sort((a, b) => a.hour - b.hour);
  const exact = sorted.find(e => e.hour === hour);
  if (exact) return exact.energy;

  let prev = sorted[0];
  let next = sorted[sorted.length - 1];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].hour <= hour && sorted[i + 1].hour > hour) {
      prev = sorted[i];
      next = sorted[i + 1];
      break;
    }
  }
  const t = (hour - prev.hour) / (next.hour - prev.hour);
  return Math.round(prev.energy + t * (next.energy - prev.energy));
}

const EnergyCurve: React.FC<EnergyCurveProps> = ({ tasks }) => {
  const currentEnergy = getCurrentEnergy();
  const currentHour = new Date().getHours();

  const { curvePath, areaPath } = useMemo(() => {
    const data = ENERGY_CURVE.filter(e => e.hour >= 5 && e.hour <= 22);
    const points = data.map(d => ({ x: toX(d.hour), y: toY(d.energy) }));

    let curve = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      curve += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const area = `${curve} L ${points[points.length - 1].x} ${H - PAD.bottom} L ${points[0].x} ${H - PAD.bottom} Z`;
    return { curvePath: curve, areaPath: area };
  }, []);

  const hours = [6, 9, 12, 15, 18, 21];
  const showCurrentTime = currentHour >= 5 && currentHour <= 22;
  const currentX = toX(currentHour);
  const currentY = toY(currentEnergy.energy);

  return (
    <div className="relative w-full">
      {/* Status badge */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="relative w-2 h-2">
          <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-30" />
          <div className="absolute inset-0 rounded-full bg-amber-400" />
        </div>
        <span className="text-xs font-medium text-white/30">
          <span className="text-amber-400 font-bold tabular-nums">{currentEnergy.energy}%</span>
          <span className="mx-1.5 text-white/10">—</span>
          {currentEnergy.label}
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <defs>
          <linearGradient id="energy-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.12" />
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="energy-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0.4" />
          </linearGradient>
          <filter id="time-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle grid lines */}
        {[25, 50, 75].map(v => (
          <line
            key={v}
            x1={PAD.left} y1={toY(v)}
            x2={W - PAD.right} y2={toY(v)}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
        ))}

        {/* Filled area */}
        <path d={areaPath} fill="url(#energy-fill)" />

        {/* Curve line */}
        <path
          d={curvePath}
          fill="none"
          stroke="url(#energy-stroke)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Hour labels */}
        {hours.map(hr => {
          const label = hr === 12 ? '12P' : hr < 12 ? hr + 'A' : (hr - 12) + 'P';
          return (
            <text
              key={hr}
              x={toX(hr)}
              y={H - 6}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="rgba(255,255,255,0.15)"
              fontFamily="DM Sans, sans-serif"
            >
              {label}
            </text>
          );
        })}

        {/* Task markers */}
        {tasks.map(t => {
          if (t.hour < 5 || t.hour > 22) return null;
          const energy = interpolateEnergy(t.hour);
          const tx = toX(t.hour);
          const ty = toY(energy);
          const color = PRIORITY_COLORS[t.priority] || '#fff';
          return (
            <g key={t.id}>
              {!t.done && (
                <circle cx={tx} cy={ty} r="8" fill={color} opacity="0.08" />
              )}
              <circle
                cx={tx} cy={ty}
                r={t.done ? 3 : 4.5}
                fill={t.done ? 'rgba(255,255,255,0.12)' : color}
              />
            </g>
          );
        })}

        {/* Current time marker */}
        {showCurrentTime && (
          <g filter="url(#time-glow)">
            <line
              x1={currentX} y1={PAD.top}
              x2={currentX} y2={H - PAD.bottom}
              stroke="rgba(245,158,11,0.15)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
            <circle cx={currentX} cy={currentY} r="7" fill="#F59E0B" opacity="0.12">
              <animate attributeName="r" values="7;13;7" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.12;0.03;0.12" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx={currentX} cy={currentY} r="5" fill="#F59E0B" />
            <circle cx={currentX} cy={currentY} r="2" fill="rgba(0,0,0,0.25)" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default EnergyCurve;
