import React from 'react';
import { Icons } from '../constants';
import { motion } from 'motion/react';

const About: React.FC = () => {
  const concepts = [
    {
      title: 'Energy Flux',
      icon: Icons.zap,
      color: 'text-orange-400',
      desc: 'Synchronize high-leverage work with your natural circadian peaks. The scheduler warns you when priorities mismatch your biological state.'
    },
    {
      title: 'Life Equilibrium',
      icon: Icons.target,
      color: 'text-blue-400',
      desc: 'A 360° view of your operational balance. Calibrate your scores daily to visualize which dimensions of your life require immediate attention.'
    },
    {
      title: 'Micro-Habit Loops',
      icon: Icons.flame,
      color: 'text-green-400',
      desc: 'Focus on atomic actions. The system resets daily, emphasizing consistency over intensity. Streaks represent your operational reliability.'
    },
    {
      title: 'Cognitive Capture',
      icon: Icons.lightbulb,
      color: 'text-yellow-400',
      desc: 'Your brain is for having ideas, not holding them. Use Quick Sparks to offload fleeting thoughts and maintain focus on the current objective.'
    }
  ];

  return (
    <div className="space-y-12 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {concepts.map((c, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={c.color}>{c.icon}</span>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/90">{c.title}</h3>
            </div>
            <p className="text-xs leading-relaxed text-white/50 font-medium">
              {c.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-500/10 to-purple-500/10 border border-white/10 text-center">
        <h3 className="font-serif text-2xl mb-4 text-white">The LifeOS Philosophy</h3>
        <p className="text-sm text-white/60 max-w-2xl mx-auto leading-relaxed italic">
          "Efficiency is doing things right; effectiveness is doing the right things. LifeOS is built to ensure you are always effective by aligning your output with your internal state."
        </p>
      </div>
    </div>
  );
};

export default About;
