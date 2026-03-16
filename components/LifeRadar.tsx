import React, { useState } from 'react';
import { LIFE_DIMENSIONS } from '../constants';
import { LifeScores } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface LifeRadarProps {
  scores: LifeScores;
  onUpdate: (key: keyof LifeScores, val: number) => void;
}

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 100;
const N = LIFE_DIMENSIONS.length;

function polarPoint(index: number, value: number) {
  const angle = (Math.PI * 2 * index) / N - Math.PI / 2;
  const r = (value / 10) * RADIUS;
  return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) };
}

function outerPoint(index: number, scale: number) {
  const angle = (Math.PI * 2 * index) / N - Math.PI / 2;
  return {
    x: CENTER + scale * Math.cos(angle),
    y: CENTER + scale * Math.sin(angle),
  };
}

const LifeRadar: React.FC<LifeRadarProps> = ({ scores, onUpdate }) => {
  const [editing, setEditing] = useState<keyof LifeScores | null>(null);

  const polygonPoints = LIFE_DIMENSIONS
    .map((_, i) => {
      const p = polarPoint(i, scores[LIFE_DIMENSIONS[i].key as keyof LifeScores] ?? 5);
      return p.x + ',' + p.y;
    })
    .join(' ');

  const avg = (Object.values(scores).reduce((a: number, b: number) => a + b, 0) / N).toFixed(1);

  return (
    <div className="flex flex-col items-center gap-5">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={'0 0 ' + SIZE + ' ' + SIZE}
        className="overflow-visible"
      >
        <defs>
          <filter id="radar-glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02" />
          </radialGradient>
        </defs>

        {/* Grid rings */}
        {[2, 4, 6, 8, 10].map(v => (
          <polygon
            key={v}
            points={LIFE_DIMENSIONS.map((_, i) => {
              const p = polarPoint(i, v);
              return p.x + ',' + p.y;
            }).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {LIFE_DIMENSIONS.map((_, i) => {
          const p = polarPoint(i, 10);
          return (
            <line
              key={i}
              x1={CENTER} y1={CENTER}
              x2={p.x} y2={p.y}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon with glow */}
        <polygon
          points={polygonPoints}
          fill="url(#radar-fill)"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinejoin="round"
          filter="url(#radar-glow)"
          style={{ transition: 'all 0.5s ease' }}
        />

        {/* Data points */}
        {LIFE_DIMENSIONS.map((dim, i) => {
          const key = dim.key as keyof LifeScores;
          const p = polarPoint(i, scores[key] ?? 5);
          const isEditing = editing === key;
          return (
            <g key={i}>
              {/* Outer pulse on active point */}
              {isEditing && (
                <circle
                  cx={p.x} cy={p.y} r="14"
                  fill="none" stroke={dim.color} strokeWidth="1" opacity="0.3"
                >
                  <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={p.x} cy={p.y}
                r={isEditing ? 7 : 5}
                fill={dim.color}
                stroke={isEditing ? '#fff' : 'transparent'}
                strokeWidth="2"
                className="cursor-pointer"
                style={{ transition: 'all 0.25s ease', filter: `drop-shadow(0 0 4px ${dim.color}40)` }}
                onClick={() => setEditing(isEditing ? null : key)}
              />
            </g>
          );
        })}

        {/* Dimension labels */}
        {LIFE_DIMENSIONS.map((dim, i) => {
          const p = outerPoint(i, RADIUS + 28);
          const key = dim.key as keyof LifeScores;
          const isActive = editing === key;
          return (
            <text
              key={i}
              x={p.x} y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fontWeight="700"
              fill={isActive ? dim.color : 'rgba(255,255,255,0.3)'}
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                transition: 'fill 0.2s',
                cursor: 'pointer',
              }}
              onClick={() => setEditing(isActive ? null : key)}
            >
              {dim.label}
            </text>
          );
        })}

        {/* Center score */}
        <text
          x={CENTER} y={CENTER - 8}
          textAnchor="middle" fontSize="26" fontWeight="700"
          fill="#3B82F6"
          fontFamily="DM Sans, sans-serif"
          style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.3))' }}
        >
          {avg}
        </text>
        <text
          x={CENTER} y={CENTER + 12}
          textAnchor="middle" fontSize="8" fontWeight="700"
          fill="rgba(255,255,255,0.15)"
          style={{ textTransform: 'uppercase', letterSpacing: '0.2em' }}
        >
          Balance
        </text>
      </svg>

      {/* Slider */}
      <div className="w-full max-w-[240px] min-h-[48px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {editing ? (
            <motion.div
              key={editing}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex items-center gap-3"
            >
              <span
                className="text-xs font-bold uppercase w-16 flex-shrink-0"
                style={{ color: LIFE_DIMENSIONS.find(d => d.key === editing)?.color }}
              >
                {LIFE_DIMENSIONS.find(d => d.key === editing)?.label}
              </span>
              <input
                type="range"
                min="0" max="10" step="1"
                value={scores[editing] ?? 5}
                onChange={e => onUpdate(editing, parseInt(e.target.value))}
                className="flex-grow"
              />
              <span className="text-sm font-bold text-blue-400 tabular-nums w-4 text-right flex-shrink-0">
                {scores[editing]}
              </span>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-white/15 text-center font-medium uppercase tracking-[0.2em]"
            >
              Tap a point to calibrate
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LifeRadar;
