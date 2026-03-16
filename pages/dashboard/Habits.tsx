import React from 'react';
import { motion } from 'motion/react';
import { useDashboard } from '../DashboardLayout';
import HabitTracker from '../../components/HabitTracker';

const Habits: React.FC = () => {
  const { habits, handleToggleHabit, handleAddHabit, handleDeleteHabit } = useDashboard();

  return (
    <div className="max-w-2xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-serif font-bold text-white mb-1">Micro-Habit Loops</h1>
        <p className="text-sm text-white/25 font-medium">Consistency beats intensity. Track your daily habits.</p>
      </motion.div>

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
    </div>
  );
};

export default Habits;
