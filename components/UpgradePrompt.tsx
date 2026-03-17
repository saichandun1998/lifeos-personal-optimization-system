import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface UpgradePromptProps {
  feature: string;
  onDismiss?: () => void;
}

const BULLET_FEATURES = [
  'AI-powered daily insights tailored to your habits',
  'Unlimited focus sessions with adaptive timers',
  'Cloud sync across all your devices',
];

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ feature, onDismiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="surface-elevated rounded-2xl p-6 max-w-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{'\u2728'}</span>
        <h3 className="font-display text-sm font-bold text-white/80">
          Unlock {feature} with LifeOS Pro
        </h3>
      </div>

      {/* Feature list */}
      <ul className="space-y-2.5 mb-6">
        {BULLET_FEATURES.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex-shrink-0">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="#f0a030" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="text-xs text-white/45 leading-relaxed font-medium">{item}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        to="/login?signup=1"
        className="block text-center w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-[0.98] mb-3"
      >
        Upgrade to Pro &mdash; $9/mo
      </Link>

      {/* Dismiss */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="block w-full text-center text-xs text-white/25 hover:text-white/40 font-medium transition-colors py-1"
        >
          Maybe later
        </button>
      )}
    </motion.div>
  );
};

export default UpgradePrompt;
