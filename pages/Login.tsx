import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Icons } from '../constants';
import { supabase } from '../src/lib/supabase';

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isSignup = searchParams.get('signup') === '1';
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      // No Supabase configured — go straight to demo dashboard
      navigate('/app');
      return;
    }

    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + window.location.pathname },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setSent(true);
      setMessage('Check your email for the magic link!');
    }
    setLoading(false);
  };

  const skipToDemo = () => navigate('/app');

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#060608' }}>
      {/* Background orbs */}
      <div className="bg-orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent)', top: -150, right: -100, animation: 'orb-1 25s ease-in-out infinite' }} />
      <div className="bg-orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(59,130,246,0.06), transparent)', bottom: -100, left: -100, animation: 'orb-2 30s ease-in-out infinite' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-black">{Icons.zap}</span>
          </div>
          <span className="text-lg font-bold text-white tracking-wide">LifeOS</span>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)' }}>
          <h1 className="text-xl font-bold text-white mb-2">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-white/30 mb-8 font-medium">
            {isSignup
              ? 'Start optimizing your life in seconds.'
              : 'Sign in with your email to continue.'
            }
          </p>

          {sent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-400 scale-150">{Icons.check}</span>
              </div>
              <p className="text-sm text-white/70 font-semibold mb-1">Check your email</p>
              <p className="text-xs text-white/30 font-medium">We sent a magic link to <span className="text-white/50">{email}</span></p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-2 block">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/40 placeholder:text-white/15 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? 'Sending...' : isSignup ? 'Create Account' : 'Send Magic Link'}
              </button>
            </form>
          )}

          {message && !sent && (
            <p className="mt-4 text-xs text-center text-red-400/80 font-medium">{message}</p>
          )}

          <div className="mt-6 pt-6 border-t border-white/[0.04] text-center">
            <button
              onClick={skipToDemo}
              className="text-xs text-white/20 hover:text-white/40 font-medium transition-colors"
            >
              Skip — try the demo without an account &rarr;
            </button>
          </div>
        </div>

        {/* Toggle login/signup */}
        <p className="text-center mt-6 text-xs text-white/25 font-medium">
          {isSignup ? (
            <>Already have an account? <Link to="/login" className="text-amber-400/60 hover:text-amber-400 transition-colors">Log in</Link></>
          ) : (
            <>Don't have an account? <Link to="/login?signup=1" className="text-amber-400/60 hover:text-amber-400 transition-colors">Sign up free</Link></>
          )}
        </p>

        {/* Back to home */}
        <p className="text-center mt-4">
          <Link to="/" className="text-[11px] text-white/15 hover:text-white/30 transition-colors font-medium">&larr; Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
