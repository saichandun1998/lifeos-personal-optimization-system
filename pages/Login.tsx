import React, { useState, useEffect } from 'react';
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/app');
    });
  }, [navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) { navigate('/app'); return; }

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

  const handleGoogleLogin = async () => {
    if (!supabase) { navigate('/app'); return; }

    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    });

    if (error) {
      setMessage(error.message);
      setGoogleLoading(false);
    }
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
          <p className="text-sm text-white/30 mb-6 font-medium">
            {isSignup ? 'Start optimizing your life in seconds.' : 'Sign in to continue.'}
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
            <>
              {/* Google Sign In */}
              {supabase && (
                <>
                  <button
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/[0.08] text-sm font-semibold text-white/70 hover:bg-white/[0.04] hover:text-white transition-all disabled:opacity-50 mb-4"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    {googleLoading ? 'Connecting...' : 'Continue with Google'}
                  </button>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-grow h-px bg-white/[0.06]" />
                    <span className="text-[10px] text-white/15 font-bold uppercase tracking-widest">or</span>
                    <div className="flex-grow h-px bg-white/[0.06]" />
                  </div>
                </>
              )}

              {/* Email form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
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
                  {loading ? 'Sending...' : 'Send Magic Link'}
                </button>
              </form>
            </>
          )}

          {message && !sent && (
            <p className="mt-4 text-xs text-center text-red-400/80 font-medium">{message}</p>
          )}

          <div className="mt-6 pt-6 border-t border-white/[0.04] text-center">
            <button
              onClick={skipToDemo}
              className="text-xs text-white/20 hover:text-white/40 font-medium transition-colors"
            >
              Skip — try without an account &rarr;
            </button>
          </div>
        </div>

        {/* Toggle */}
        <p className="text-center mt-6 text-xs text-white/25 font-medium">
          {isSignup ? (
            <>Already have an account? <Link to="/login" className="text-amber-400/60 hover:text-amber-400 transition-colors">Log in</Link></>
          ) : (
            <>New here? <Link to="/login?signup=1" className="text-amber-400/60 hover:text-amber-400 transition-colors">Sign up free</Link></>
          )}
        </p>
        <p className="text-center mt-4">
          <Link to="/" className="text-[11px] text-white/15 hover:text-white/30 transition-colors font-medium">&larr; Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
