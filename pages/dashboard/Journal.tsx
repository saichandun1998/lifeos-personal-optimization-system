import React from 'react';
import { motion } from 'motion/react';
import { useDashboard } from '../DashboardLayout';
import QuickCapture from '../../components/QuickCapture';
import DailyReflection from '../../components/DailyReflection';
import DecisionMaker from '../../components/DecisionMaker';
import Card from '../../components/Card';
import { Icons } from '../../constants';

const Journal: React.FC = () => {
  const { notes, dailyReflections, handleAddNote, handleDeleteNote, handleAddReflection } = useDashboard();

  return (
    <div className="max-w-6xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Daily Journal</h1>
        <p className="text-sm text-white/25 font-medium">Capture thoughts, reflect on your day, break through decisions.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <motion.div
          className="lg:col-span-3 p-6 rounded-2xl border border-white/[0.04]"
          style={{ background: 'rgba(255,255,255,0.015)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-display font-semibold text-white/60 mb-4">Quick Capture</h2>
          <QuickCapture notes={notes} onAdd={handleAddNote} onDelete={handleDeleteNote} />
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <DailyReflection reflections={dailyReflections} onAdd={handleAddReflection} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card title="Decision Dice" icon={Icons.shuffle} accentColor="#8B5CF6" defaultCollapsed={true}>
              <DecisionMaker />
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
