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
      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs text-orange-400">
        Supabase keys missing. Please configure .env to enable cloud sync.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-blue-400">{Icons.target}</span>
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/90">Cloud Protocol</h3>
      </div>
      <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wider">
        Connect your account to synchronize your operational data across all devices.
      </p>
      
      <form onSubmit={handleLogin} className="space-y-3">
        <input
          type="email"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-blue-500 placeholder:text-white/20 transition-colors"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Send Magic Link'}
        </button>
      </form>
      
      {message && (
        <p className="text-[10px] text-center text-blue-400 font-bold uppercase animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Auth;
