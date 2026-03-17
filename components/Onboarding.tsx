import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icons } from '../constants';

interface OnboardingProps {
  onComplete: (selectedHabits: { name: string; emoji: string }[], goal: string) => void;
}

const HABIT_SUGGESTIONS = [
  { name: 'Morning Sunlight', emoji: '\u2600\uFE0F' },
  { name: 'Deep Work', emoji: '\uD83D\uDCBB' },
  { name: 'Exercise', emoji: '\uD83C\uDFC3' },
  { name: 'Read', emoji: '\uD83D\uDCDA' },
  { name: 'Meditate', emoji: '\uD83E\uDDD8' },
  { name: 'Journal', emoji: '\u270D\uFE0F' },
  { name: 'Hydration', emoji: '\uD83D\uDCA7' },
  { name: 'Evening Walk', emoji: '\uD83D\uDEB6' },
];

const WAKE_TIMES = ['5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM'];

const PRE_SELECTED = new Set([0, 1, 4]); // Morning Sunlight, Deep Work, Meditate

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [selectedHabits, setSelectedHabits] = useState<Set<number>>(() => new Set(PRE_SELECTED));
  const [goal, setGoal] = useState('');
  const [wakeTime, setWakeTime] = useState('7:00 AM');

  const toggleHabit = (index: number) => {
    setSelectedHabits(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleComplete = () => {
    const habits = Array.from(selectedHabits).map(i => ({
      name: HABIT_SUGGESTIONS[i].name,
      emoji: HABIT_SUGGESTIONS[i].emoji,
    }));
    onComplete(habits, goal);
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);

  const goNext = () => {
    setDirection(1);
    setStep(s => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-md mx-4">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: step === i ? 32 : 8,
                background: step === i ? '#f0a030' : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>

        {/* Card */}
        <div className="surface-elevated rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 0 && (
              <motion.div
                key="step0"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="p-8 text-center"
              >
                {/* Logo */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <span className="text-black scale-125">{Icons.zap}</span>
                </div>
                <h1 className="font-display text-2xl font-bold text-white mb-3">Welcome to LifeOS</h1>
                <p className="text-sm text-white/40 mb-8 leading-relaxed">
                  Let's set up your personal operating system in 60 seconds.
                </p>
                <button
                  onClick={goNext}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-[0.98]"
                >
                  Get Started
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="p-8"
              >
                <h2 className="font-display text-xl font-bold text-white mb-2 text-center">Pick your habits</h2>
                <p className="text-xs text-white/30 mb-6 text-center">Select the habits you want to build. You can change these later.</p>

                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {HABIT_SUGGESTIONS.map((habit, i) => (
                    <button
                      key={i}
                      onClick={() => toggleHabit(i)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: selectedHabits.has(i) ? 'rgba(240,160,48,0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${selectedHabits.has(i) ? 'rgba(240,160,48,0.3)' : 'rgba(255,255,255,0.06)'}`,
                        color: selectedHabits.has(i) ? '#f0a030' : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      <span>{habit.emoji}</span>
                      <span>{habit.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={goBack}
                    className="flex-1 py-3 rounded-xl border border-white/[0.06] text-white/40 font-medium text-sm hover:bg-white/[0.03] transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={goNext}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-[0.98]"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="p-8"
              >
                <h2 className="font-display text-xl font-bold text-white mb-2 text-center">Set your focus</h2>
                <p className="text-xs text-white/30 mb-6 text-center">One goal, one routine. Let's lock it in.</p>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-2">
                      What's your #1 goal this week?
                    </label>
                    <input
                      type="text"
                      value={goal}
                      onChange={e => setGoal(e.target.value)}
                      placeholder="e.g., Launch the landing page"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white/80 placeholder-white/20 outline-none transition-all focus:border-amber-500/30"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-2">
                      What time do you usually wake up?
                    </label>
                    <select
                      value={wakeTime}
                      onChange={e => setWakeTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white/80 outline-none transition-all focus:border-amber-500/30"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {WAKE_TIMES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={goBack}
                    className="flex-1 py-3 rounded-xl border border-white/[0.06] text-white/40 font-medium text-sm hover:bg-white/[0.03] transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleComplete}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-[0.98]"
                  >
                    All set!
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
