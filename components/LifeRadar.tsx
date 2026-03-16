import React, { useState } from 'react';
import { LIFE_DIMENSIONS } from '../constants';
import { LifeScores } from '../types';

interface LifeRadarProps {
  scores: LifeScores;
  onUpdate: (key: keyof LifeScores, val: number) => void;
}

const SIZE = 260;
const CENTER = SIZE / 2;
const RADIUS = 90;
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
    <div className="flex flex-col items-center gap-4">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={"0 0 " + SIZE + " " + SIZE}
        className="overflow-visible"
        aria-label="Life balance radar chart"
      >
        {/* Grid rings */}
        {[2, 4, 6, 8, 10].map(v => (
          <polygon
            key={v}
            points={LIFE_DIMENSIONS.map((_, i) => {
              const p = polarPoint(i, v);
              return p.x + ',' + p.y;
            }).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
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
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(255,149,0,0.08)"
          stroke="#ff9500"
          strokeWidth="2"
          style={{ transition: 'all 0.4s ease' }}
        />

        {/* Data points */}
        {LIFE_DIMENSIONS.map((dim, i) => {
          const key = dim.key as keyof LifeScores;
          const p = polarPoint(i, scores[key] ?? 5);
          const isEditing = editing === key;
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={isEditing ? 8 : 6}
              fill={dim.color}
              stroke={isEditing ? '#fff' : 'transparent'}
              strokeWidth="2"
              className="cursor-pointer"
              style={{ transition: 'all 0.2s ease' }}
              onClick={() => setEditing(isEditing ? null : key)}
              aria-label={"Edit " + dim.label + " score, currently " + (scores[key] ?? 5)}
              role="button"
            />
          );
        })}

        {/* Dimension labels */}
        {LIFE_DIMENSIONS.map((dim, i) => {
          const p = outerPoint(i, RADIUS + 26);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fontWeight="700"
              fill="rgba(255,255,255,0.4)"
              style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
            >
              {dim.label}
            </text>
          );
        })}

        {/* Centre score */}
        <text x={CENTER} y={CENTER - 9} textAnchor="middle" fontSize="24" fontWeight="700" fill="#ff9500" fontFamily="Georgia, serif">
          {avg}
        </text>
        <text x={CENTER} y={CENTER + 12} textAnchor="middle" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.2)" style={{ textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Balance
        </text>
      </svg>

      {/* Slider for active dimension */}
      <div className="w-full max-w-[220px] min-h-[48px] flex items-center justify-center">
        {editing ? (
          <div className="w-full bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <span className="text-xs font-bold text-white/50 uppercase w-20 flex-shrink-0">
              {LIFE_DIMENSIONS.find(d => d.key === editing)?.label}
            </span>
            <input
              type="range"
              min="0" max="10" step="1"
              value={scores[editing] ?? 5}
              onChange={e => onUpdate(editing, parseInt(e.target.value))}
              className="flex-grow accent-orange-500"
              aria-label={"Adjust " + editing + " score"}
            />
            <span className="text-sm font-bold text-orange-400 tabular-nums w-4 text-right flex-shrink-0">
              {scores[editing]}
            </span>
          </div>
        ) : (
          <p className="text-[10px] text-white/20 text-center font-medium uppercase tracking-[0.2em]">
            Tap a point to calibrate
          </p>
        )}
      </div>
    </div>
  );
};

export default LifeRadar;
