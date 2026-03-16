import React from 'react';
import { motion } from 'motion/react';
import DecisionMaker from '../../components/DecisionMaker';

const Decide: React.FC = () => {
  return (
    <div className="max-w-lg space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-serif font-bold text-white mb-1">Decision Engine</h1>
        <p className="text-sm text-white/25 font-medium">Stuck? Let structured randomness break the tie.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl border border-white/[0.04]"
        style={{ background: 'rgba(255,255,255,0.015)' }}
      >
        <DecisionMaker />
      </motion.div>
    </div>
  );
};

export default Decide;
