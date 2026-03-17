import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../constants';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ background: '#08090d' }}>
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <span className="text-black scale-90">{Icons.zap}</span>
          </div>
          <span className="font-display text-sm font-bold text-white/70 tracking-wide">LifeOS</span>
        </Link>
        <Link to="/" className="text-sm text-white/30 hover:text-white/60 font-medium transition-colors">
          &larr; Back to Home
        </Link>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-white/25 mb-10">Effective: March 2026</p>

        <div className="space-y-8 text-sm text-white/50 leading-relaxed">
          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">What We Collect</h2>
            <p>
              When you create an account, we collect your <strong className="text-white/60">email address</strong> via Google OAuth or email/password signup. We also store the data you create within LifeOS, including habits, tasks, journal entries, focus sessions, life scores, and daily reflections.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">How We Store It</h2>
            <p>
              Your data is stored in <strong className="text-white/60">Supabase</strong> (PostgreSQL) when you are signed in. For offline use, data is also cached in your browser's localStorage. We do not store data on any other third-party servers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">AI Features</h2>
            <p>
              LifeOS uses the <strong className="text-white/60">Gemini AI API</strong> to generate personalized insights. When you use AI features, we send anonymized, aggregated data (such as habit completion rates and focus session statistics) to generate recommendations. We do not send personally identifiable information to the AI service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">What We Don't Do</h2>
            <ul className="list-disc list-inside space-y-1.5 text-white/45">
              <li>We do <strong className="text-white/60">not</strong> sell your data to third parties</li>
              <li>We do <strong className="text-white/60">not</strong> use your data for advertising</li>
              <li>We do <strong className="text-white/60">not</strong> share your personal information with anyone</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">Your Rights</h2>
            <p>
              You can <strong className="text-white/60">export</strong> all your data at any time from the Settings page. You can also request complete <strong className="text-white/60">deletion</strong> of your account and all associated data by contacting us. Local data can be cleared directly from your browser.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">Cookies & Local Storage</h2>
            <p>
              We use localStorage to cache your data for offline access and to store your preferences. We do not use tracking cookies or any third-party analytics.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">Changes</h2>
            <p>
              We may update this policy from time to time. If we make significant changes, we will notify you through the app. Continued use of LifeOS after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">Contact</h2>
            <p>
              Questions about this policy? Reach us at{' '}
              <a href="mailto:saichandun1998@gmail.com" className="text-amber-400/70 hover:text-amber-400 transition-colors">
                saichandun1998@gmail.com
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-6 py-8">
        <div className="h-px bg-white/[0.04] mb-6" />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/15">&copy; 2026 LifeOS</span>
          <div className="flex items-center gap-4 text-[11px] text-white/15">
            <Link to="/privacy" className="text-white/30">Privacy</Link>
            <Link to="/terms" className="hover:text-white/30 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
