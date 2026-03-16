import React from 'react';
import { motion } from 'motion/react';
import { useDashboard } from '../DashboardLayout';
import { getCurrentEnergy } from '../../utils';
import FocusTimer from '../../components/FocusTimer';

const Focus: React.FC = () => {
  const { tasks, focusSessions, handleAddFocusSession } = useDashboard();
  const energy = getCurrentEnergy();

  return (
    <div className="max-w-6xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Focus Mode</h1>
        <p className="text-sm text-white/25 font-medium">Work with your energy, not against it.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <FocusTimer
          currentEnergy={energy}
          tasks={tasks}
          focusSessions={focusSessions}
          onSessionComplete={handleAddFocusSession}
        />
      </motion.div>
    </div>
  );
};

export default Focus;
