import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useDashboard } from '../DashboardLayout';
import { supabase } from '../../src/lib/supabase';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { user, habits, tasks, notes, lifeScores, focusSessions, dailyReflections } = useDashboard();
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const loginMethod = user?.app_metadata?.provider === 'google' ? 'Google' : 'Email';

  const exportData = () => {
    const data = { habits, tasks, notes, lifeScores, focusSessions, dailyReflections };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lifeos-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearLocalData = () => {
    const keys = [
      'lifeos_habits', 'lifeos_tasks', 'lifeos_notes', 'lifeos_scores',
      'lifeos_focus', 'lifeos_reflections', 'lifeos_onboarded', 'lifeos_goal',
      'lifeos_updated_at',
    ];
    keys.forEach(k => localStorage.removeItem(k));
    setShowClearConfirm(false);
    window.location.reload();
  };

  const handleSignOut = async () => {
    if (supabase && user) {
      await supabase.auth.signOut();
    }
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-white/30 mb-8">Manage your account and data.</p>
      </motion.div>

      {/* Account */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="surface-elevated rounded-2xl p-6"
      >
        <h2 className="font-display text-sm font-bold text-white/70 uppercase tracking-wider mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-white/40">Email</span>
            <span className="text-sm text-white/70 font-medium">{user?.email || 'Not signed in'}</span>
          </div>
          <div className="h-px bg-white/[0.04]" />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-white/40">Login method</span>
            <span className="text-sm text-white/70 font-medium">{user ? loginMethod : 'N/A'}</span>
          </div>
        </div>
      </motion.section>

      {/* Data */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="surface-elevated rounded-2xl p-6"
      >
        <h2 className="font-display text-sm font-bold text-white/70 uppercase tracking-wider mb-4">Data</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm text-white/60 font-medium">Export Data</span>
              <p className="text-xs text-white/25 mt-0.5">Download all your data as JSON</p>
            </div>
            <button
              onClick={exportData}
              className="px-4 py-2 rounded-xl text-xs font-bold text-amber-400 transition-all hover:bg-amber-500/10"
              style={{ background: 'rgba(240,160,48,0.06)', border: '1px solid rgba(240,160,48,0.12)' }}
            >
              Export
            </button>
          </div>
          <div className="h-px bg-white/[0.04]" />
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm text-white/60 font-medium">Clear Local Data</span>
              <p className="text-xs text-white/25 mt-0.5">Remove all locally stored data</p>
            </div>
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white/40 transition-all hover:bg-white/[0.04]"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                Clear
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-white/30 hover:text-white/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={clearLocalData}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-red-400 transition-all hover:bg-red-500/10"
                  style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
                >
                  Confirm Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* About */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="surface-elevated rounded-2xl p-6"
      >
        <h2 className="font-display text-sm font-bold text-white/70 uppercase tracking-wider mb-4">About</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-white/40">Version</span>
            <span className="text-sm text-white/50 font-mono">v1.0.0</span>
          </div>
          <div className="h-px bg-white/[0.04]" />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-white/40">Privacy Policy</span>
            <a href="/privacy" className="text-sm text-amber-400/70 hover:text-amber-400 font-medium transition-colors">View</a>
          </div>
          <div className="h-px bg-white/[0.04]" />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-white/40">Terms of Service</span>
            <a href="/terms" className="text-sm text-amber-400/70 hover:text-amber-400 font-medium transition-colors">View</a>
          </div>
        </div>
      </motion.section>

      {/* Danger Zone */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl p-6"
        style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.08)' }}
      >
        <h2 className="font-display text-sm font-bold text-red-400/70 uppercase tracking-wider mb-4">Danger Zone</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm text-white/60 font-medium">Sign Out</span>
              <p className="text-xs text-white/25 mt-0.5">Sign out of your account</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl text-xs font-bold text-red-400 transition-all hover:bg-red-500/10"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
            >
              Sign Out
            </button>
          </div>
          <div className="h-px bg-red-400/[0.06]" />
          <div className="py-2">
            <span className="text-sm text-white/60 font-medium">Delete Account</span>
            <p className="text-xs text-white/25 mt-1">
              Contact support to delete your account and all associated data.
            </p>
            <p className="text-xs text-amber-400/50 mt-1 font-medium">saichandun1998@gmail.com</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Settings;
