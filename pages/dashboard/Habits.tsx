import React from 'react';
import { motion } from 'motion/react';
import { useDashboard } from '../DashboardLayout';
import HabitTracker from '../../components/HabitTracker';
import LifeRadar from '../../components/LifeRadar';

const Habits: React.FC = () => {
  const { habits, handleToggleHabit, handleAddHabit, handleDeleteHabit, lifeScores, setLifeScores } = useDashboard();

  return (
    <div className="max-w-6xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Micro-Habit Loops</h1>
        <p className="text-sm text-white/25 font-medium">Consistency beats intensity. Track your daily habits.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl border border-white/[0.04]"
          style={{ background: 'rgba(255,255,255,0.015)' }}
        >
          <HabitTracker
            habits={habits}
            onToggle={handleToggleHabit}
            onAdd={handleAddHabit}
            onDelete={handleDeleteHabit}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6 rounded-2xl border border-white/[0.04]" style={{ background: 'rgba(255,255,255,0.015)' }}>
            <h2 className="text-sm font-display font-semibold text-white/60 mb-4">Life Balance</h2>
            <LifeRadar scores={lifeScores} onUpdate={(k, v) => setLifeScores(prev => ({ ...prev, [k]: v }))} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Habits;
