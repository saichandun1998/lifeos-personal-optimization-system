import React, { useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { Icons } from '../constants';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the login link!');
    }
    setLoading(false);
  };

  if (!supabase) {
    return (
      <div
        className="p-4 rounded-xl text-xs font-medium border"
        style={{
          background: 'rgba(245,158,11,0.04)',
          borderColor: 'rgba(245,158,11,0.1)',
          color: 'rgba(245,158,11,0.7)',
        }}
      >
        Supabase keys missing. Configure .env to enable cloud sync.
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-2xl space-y-4"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}
        >
          {Icons.user}
        </div>
        <h3 className="text-sm font-semibold text-white/80 tracking-wide">Cloud Sync</h3>
      </div>
      <p className="text-[10px] text-white/25 leading-relaxed font-medium">
        Connect to sync your data across all devices.
      </p>

      <form onSubmit={handleLogin} className="space-y-3">
        <input
          type="email"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/40 placeholder:text-white/12 transition-colors"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-40 shadow-lg shadow-blue-600/15"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </form>

      {message && (
        <p className="text-[10px] text-center text-blue-400/80 font-semibold">
          {message}
        </p>
      )}
    </div>
  );
};

export default Auth;
