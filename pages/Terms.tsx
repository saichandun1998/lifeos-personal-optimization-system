import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../constants';

const Terms: React.FC = () => {
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
        <h1 className="font-display text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-white/25 mb-10">Effective: March 2026</p>

        <div className="space-y-8 text-sm text-white/50 leading-relaxed">
          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">Acceptance of Terms</h2>
            <p>
              By accessing or using LifeOS, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">Service Description</h2>
            <p>
              LifeOS is a personal optimization platform that helps you track habits, schedule tasks, maintain a journal, and monitor your life balance. The service is provided <strong className="text-white/60">"as-is"</strong> without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">Free & Paid Tiers</h2>
            <p>
              LifeOS offers a <strong className="text-white/60">free tier</strong> with core features including energy scheduling, habit tracking, life radar, quick notes, and local storage. A <strong className="text-white/60">paid Pro tier</strong> ($9/month) provides additional features such as AI insights, unlimited focus sessions, cloud sync, and data analytics. We reserve the right to modify pricing with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">User Responsibilities</h2>
            <ul className="list-disc list-inside space-y-1.5 text-white/45">
              <li>You are responsible for maintaining the security of your account</li>
              <li>You are responsible for the accuracy and backup of your own data</li>
              <li>You agree not to misuse the service or attempt to access it through unauthorized means</li>
              <li>You must be at least 13 years of age to use LifeOS</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">Account Termination</h2>
            <p>
              You may terminate your account at any time by contacting us. We may also suspend or terminate accounts that violate these terms. Upon termination, your data will be deleted within 30 days unless you request an export.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">Limitation of Liability</h2>
            <p>
              LifeOS and its creators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. The service is a productivity tool and does not provide medical, financial, or professional advice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of <strong className="text-white/60">India</strong>. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of courts in India.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of LifeOS after changes constitutes acceptance. We will notify you of significant changes through the app.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-bold text-white/70 mb-3">Contact</h2>
            <p>
              Questions about these terms? Reach us at{' '}
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
            <Link to="/privacy" className="hover:text-white/30 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-white/30">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
