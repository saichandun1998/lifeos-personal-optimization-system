import React from 'react';
import { motion } from 'motion/react';
import { useDashboard } from '../DashboardLayout';
import LifeRadar from '../../components/LifeRadar';

const Radar: React.FC = () => {
  const { lifeScores, setLifeScores } = useDashboard();

  return (
    <div className="max-w-2xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-serif font-bold text-white mb-1">Life Equilibrium</h1>
        <p className="text-sm text-white/25 font-medium">A 360° view of your life balance. Tap a dimension to adjust.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl border border-white/[0.04]"
        style={{ background: 'rgba(255,255,255,0.015)' }}
      >
        <LifeRadar
          scores={lifeScores}
          onUpdate={(k, v) => setLifeScores(prev => ({ ...prev, [k]: v }))}
        />
      </motion.div>
    </div>
  );
};

export default Radar;
