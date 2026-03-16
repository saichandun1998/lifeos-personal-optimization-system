import React from 'react';
import { motion } from 'motion/react';
import { useDashboard } from '../DashboardLayout';
import EnergyCurve from '../../components/EnergyCurve';
import TaskScheduler from '../../components/TaskScheduler';
import DaySummary from '../../components/DaySummary';
import { getCurrentEnergy } from '../../utils';

const Schedule: React.FC = () => {
  const { tasks, handleAddTask, handleToggleTask, handleDeleteTask } = useDashboard();
  const energy = getCurrentEnergy();

  return (
    <div className="max-w-6xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Energy-Sync Scheduler</h1>
        <p className="text-sm text-white/25 font-medium">Align your tasks with your natural energy curve.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <motion.div
          className="lg:col-span-3 p-6 rounded-2xl border border-white/[0.04]"
          style={{ background: 'rgba(255,255,255,0.015)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <EnergyCurve tasks={tasks} />
        </motion.div>

        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <DaySummary tasks={tasks} currentEnergy={energy} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl border border-white/[0.04]"
        style={{ background: 'rgba(255,255,255,0.015)' }}
      >
        <h2 className="text-sm font-semibold text-white/60 mb-4">Today's Objectives</h2>
        <TaskScheduler
          tasks={tasks}
          onAdd={handleAddTask}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
        />
      </motion.div>
    </div>
  );
};

export default Schedule;
