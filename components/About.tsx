import React from 'react';
import { Icons } from '../constants';
import { motion } from 'motion/react';

const About: React.FC = () => {
  const concepts = [
    {
      title: 'Energy Flux',
      icon: Icons.zap,
      color: '#F59E0B',
      desc: 'Synchronize high-leverage work with your natural circadian peaks. The scheduler warns you when priorities mismatch your biological state.',
    },
    {
      title: 'Life Equilibrium',
      icon: Icons.target,
      color: '#3B82F6',
      desc: 'A 360\u00B0 view of your operational balance. Calibrate your scores daily to visualize which dimensions of your life need attention.',
    },
    {
      title: 'Micro-Habit Loops',
      icon: Icons.flame,
      color: '#10B981',
      desc: 'Focus on atomic actions. The system resets daily, emphasizing consistency over intensity. Streaks represent your operational reliability.',
    },
    {
      title: 'Cognitive Capture',
      icon: Icons.lightbulb,
      color: '#EAB308',
      desc: 'Your brain is for having ideas, not holding them. Use Quick Sparks to offload fleeting thoughts and maintain focus on the current objective.',
    },
  ];

  return (
    <div className="space-y-12 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl border border-white/[0.04] hover:border-white/[0.08] transition-all group"
            style={{ background: 'rgba(255,255,255,0.015)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: c.color + '12', color: c.color }}
              >
                {c.icon}
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">{c.title}</h3>
            </div>
            <p className="text-xs leading-relaxed text-white/35 font-medium">
              {c.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-8 rounded-2xl text-center border border-white/[0.04]"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.04), rgba(139,92,246,0.04))',
        }}
      >
        <h3 className="font-serif text-2xl mb-4 gradient-text inline-block">The LifeOS Philosophy</h3>
        <p className="text-sm text-white/35 max-w-2xl mx-auto leading-relaxed italic font-medium">
          "Efficiency is doing things right; effectiveness is doing the right things. LifeOS is built to ensure you are always effective by aligning your output with your internal state."
        </p>
      </motion.div>
    </div>
  );
};

export default About;
