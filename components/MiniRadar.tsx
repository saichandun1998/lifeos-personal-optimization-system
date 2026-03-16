import React from 'react';
import { LIFE_DIMENSIONS } from '../constants';
import { LifeScores } from '../types';
import { motion } from 'motion/react';

interface MiniRadarProps {
  scores: LifeScores;
}

const SIZE = 160;
const CENTER = SIZE / 2;
const RADIUS = 55;
const N = LIFE_DIMENSIONS.length;

/** 3-letter abbreviation for each dimension */
const ABBREV: Record<string, string> = {
  health: 'HLT',
  work: 'WRK',
  relationships: 'SOC',
  growth: 'MND',
  finance: 'WLT',
  joy: 'PLY',
};

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

const MiniRadar: React.FC<MiniRadarProps> = ({ scores }) => {
  const polygonPoints = LIFE_DIMENSIONS
    .map((_, i) => {
      const key = LIFE_DIMENSIONS[i].key as keyof LifeScores;
      const p = polarPoint(i, scores[key] ?? 5);
      return p.x + ',' + p.y;
    })
    .join(' ');

  const avg = (
    Object.values(scores).reduce((a: number, b: number) => a + b, 0) / N
  ).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex items-center justify-center"
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={'0 0 ' + SIZE + ' ' + SIZE}
        className="overflow-visible"
      >
        <defs>
          <filter id="mini-radar-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="mini-radar-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.01" />
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
              x1={CENTER}
              y1={CENTER}
              x2={p.x}
              y2={p.y}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill="url(#mini-radar-fill)"
          stroke="#3B82F6"
          strokeWidth="1.5"
          strokeLinejoin="round"
          filter="url(#mini-radar-glow)"
          style={{ transition: 'all 0.5s ease' }}
        />

        {/* Data dots */}
        {LIFE_DIMENSIONS.map((dim, i) => {
          const key = dim.key as keyof LifeScores;
          const p = polarPoint(i, scores[key] ?? 5);
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill={dim.color}
              style={{ filter: `drop-shadow(0 0 3px ${dim.color}40)` }}
            />
          );
        })}

        {/* Abbreviated dimension labels */}
        {LIFE_DIMENSIONS.map((dim, i) => {
          const p = outerPoint(i, RADIUS + 16);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="7"
              fontWeight="700"
              fill="rgba(255,255,255,0.25)"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {ABBREV[dim.key] ?? dim.label.slice(0, 3).toUpperCase()}
            </text>
          );
        })}

        {/* Center average score */}
        <text
          x={CENTER}
          y={CENTER - 5}
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="#3B82F6"
          fontFamily="DM Sans, sans-serif"
          style={{ filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.3))' }}
        >
          {avg}
        </text>
        <text
          x={CENTER}
          y={CENTER + 8}
          textAnchor="middle"
          fontSize="6"
          fontWeight="700"
          fill="rgba(255,255,255,0.12)"
          style={{ textTransform: 'uppercase', letterSpacing: '0.2em' }}
        >
          Balance
        </text>
      </svg>
    </motion.div>
  );
};

export default MiniRadar;
