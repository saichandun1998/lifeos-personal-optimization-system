import React from 'react';
import { motion } from 'motion/react';
import { useDashboard } from '../DashboardLayout';
import QuickCapture from '../../components/QuickCapture';

const Notes: React.FC = () => {
  const { notes, handleAddNote, handleDeleteNote } = useDashboard();

  return (
    <div className="max-w-2xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-serif font-bold text-white mb-1">Quick Sparks</h1>
        <p className="text-sm text-white/25 font-medium">Your brain is for having ideas, not holding them.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl border border-white/[0.04]"
        style={{ background: 'rgba(255,255,255,0.015)' }}
      >
        <QuickCapture
          notes={notes}
          onAdd={handleAddNote}
          onDelete={handleDeleteNote}
        />
      </motion.div>
    </div>
  );
};

export default Notes;
