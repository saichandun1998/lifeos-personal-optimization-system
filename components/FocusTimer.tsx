import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icons, FOCUS_PRESETS } from '../constants';
import { Task, FocusSession } from '../types';
import { generateId, todayKey } from '../utils';
import { motion, AnimatePresence } from 'motion/react';

interface FocusTimerProps {
  currentEnergy: { energy: number; label: string };
  tasks: Task[];
  focusSessions: FocusSession[];
  onSessionComplete: (session: FocusSession) => void;
}

const RING_SIZE = 200;
const RING_CENTER = RING_SIZE / 2;
const RING_STROKE = 6;
const RING_RADIUS = (RING_SIZE - RING_STROKE * 2) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function getEnergySuggestion(energy: number): string {
  if (energy >= 80) return 'Perfect for deep work. Try a 50-min session.';
  if (energy >= 60) return 'Good energy. Standard 25-min session recommended.';
  if (energy >= 40) return 'Moderate energy. Try a 15-min burst.';
  return 'Low energy. A 10-min micro-session or break is best.';
}

function getRingColor(energy: number): string {
  if (energy >= 60) return '#f0a030';
  if (energy >= 40) return '#3B82F6';
  return '#8B5CF6';
}

function formatMmSs(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function playCompletionTone(): void {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Audio not available — silently ignore
  }
}

const FocusTimer: React.FC<FocusTimerProps> = ({
  currentEnergy,
  tasks,
  focusSessions,
  onSessionComplete,
}) => {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(FOCUS_PRESETS[0].duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const startedAtRef = useRef<string | null>(null);

  const preset = FOCUS_PRESETS[selectedPreset];
  const totalSeconds = preset.duration * 60;
  const progress = 1 - timeRemaining / totalSeconds;
  const ringOffset = RING_CIRCUMFERENCE - progress * RING_CIRCUMFERENCE;
  const ringColor = getRingColor(currentEnergy.energy);

  // Today's stats
  const today = todayKey();
  const todaySessions = focusSessions.filter(
    s => s.completedAt && s.completedAt.startsWith(today)
  );
  const todayFocusMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);

  // Select preset
  const handleSelectPreset = useCallback(
    (index: number) => {
      if (isRunning) return;
      setSelectedPreset(index);
      setTimeRemaining(FOCUS_PRESETS[index].duration * 60);
    },
    [isRunning]
  );

  // Timer countdown
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);

          // Session complete
          playCompletionTone();
          const session: FocusSession = {
            id: generateId(),
            type: preset.type,
            duration: preset.duration,
            startedAt: startedAtRef.current || new Date().toISOString(),
            completedAt: new Date().toISOString(),
            energyAtStart: currentEnergy.energy,
          };
          onSessionComplete(session);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, preset, currentEnergy.energy, onSessionComplete]);

  const handleStart = () => {
    if (timeRemaining === 0) {
      setTimeRemaining(totalSeconds);
    }
    startedAtRef.current = new Date().toISOString();
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(totalSeconds);
    startedAtRef.current = null;
  };

  return (
    <div className="space-y-6">
      {/* Timer ring */}
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: RING_SIZE, height: RING_SIZE }}>
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            className="-rotate-90"
          >
            <defs>
              <filter id="timer-glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Background ring */}
            <circle
              cx={RING_CENTER}
              cy={RING_CENTER}
              r={RING_RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={RING_STROKE}
            />
            {/* Progress ring */}
            <circle
              cx={RING_CENTER}
              cy={RING_CENTER}
              r={RING_RADIUS}
              fill="none"
              stroke={ringColor}
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={ringOffset}
              filter="url(#timer-glow)"
              style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.3s ease' }}
            />
          </svg>
          {/* Center time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-display text-4xl font-bold tabular-nums"
              style={{ color: ringColor, filter: `drop-shadow(0 0 12px ${ringColor}40)` }}
            >
              {formatMmSs(timeRemaining)}
            </span>
            <span className="text-[10px] text-white/20 font-semibold uppercase tracking-[0.2em] mt-1">
              {preset.label}
            </span>
          </div>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="flex gap-2 justify-center">
        {FOCUS_PRESETS.map((p, i) => (
          <button
            key={p.type}
            onClick={() => handleSelectPreset(i)}
            className={[
              'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all',
              selectedPreset === i
                ? 'border-amber-500/25 text-amber-400'
                : 'bg-white/[0.015] border-white/[0.04] text-white/25 hover:bg-white/[0.04] hover:text-white/40',
            ].join(' ')}
            style={
              selectedPreset === i
                ? { background: 'rgba(240,160,48,0.08)' }
                : undefined
            }
          >
            {p.label} {p.duration}m
          </button>
        ))}
      </div>

      {/* Control buttons */}
      <div className="flex gap-3 justify-center">
        {!isRunning ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:shadow-lg hover:shadow-amber-500/15 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #f0a030, #e08a20)',
            }}
          >
            <span>{Icons.play}</span>
            {timeRemaining < totalSeconds && timeRemaining > 0 ? 'Resume' : 'Start'}
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePause}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/[0.08] text-white/70 hover:bg-white/[0.04] transition-all"
          >
            <span>{Icons.pause}</span>
            Pause
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm border border-white/[0.06] text-white/25 hover:text-white/50 hover:bg-white/[0.03] transition-all"
        >
          <span>{Icons.refresh}</span>
          Reset
        </motion.button>
      </div>

      {/* Energy suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-4 text-center"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <p className="text-xs text-white/40 leading-relaxed">
          Your energy is at{' '}
          <span className="font-bold tabular-nums" style={{ color: ringColor }}>
            {currentEnergy.energy}%
          </span>{' '}
          — {getEnergySuggestion(currentEnergy.energy)}
        </p>
      </motion.div>

      {/* Today's stats */}
      <div className="flex justify-center gap-6">
        <div className="text-center">
          <div className="text-lg font-bold text-white/70 tabular-nums font-display">
            {todaySessions.length}
          </div>
          <div className="text-[10px] text-white/20 font-semibold uppercase tracking-[0.15em]">
            Sessions today
          </div>
        </div>
        <div className="w-px bg-white/[0.06]" />
        <div className="text-center">
          <div className="text-lg font-bold text-white/70 tabular-nums font-display">
            {todayFocusMinutes}m
          </div>
          <div className="text-[10px] text-white/20 font-semibold uppercase tracking-[0.15em]">
            Focus time
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
