import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './src/lib/supabase';
import Landing from './pages/Landing';
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Schedule from './pages/dashboard/Schedule';
import Habits from './pages/dashboard/Habits';
import Focus from './pages/dashboard/Focus';
import Journal from './pages/dashboard/Journal';

/** Handles OAuth redirect — after Google login, Supabase puts tokens in the URL hash.
 *  BrowserRouter doesn't use the hash, so Supabase can read it freely.
 *  Once session is detected, redirect to /app. */
const AuthRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!supabase) return;

    // Listen for auth state changes (fires after OAuth token exchange)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Only redirect if we're on the landing page or login page
        if (location.pathname === '/' || location.pathname === '/login') {
          navigate('/app', { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <>
      <AuthRedirectHandler />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="focus" element={<Focus />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="habits" element={<Habits />} />
          <Route path="journal" element={<Journal />} />
          {/* Redirects for old routes */}
          <Route path="notes" element={<Navigate to="/app/journal" replace />} />
          <Route path="decide" element={<Navigate to="/app/journal" replace />} />
          <Route path="radar" element={<Navigate to="/app/habits" replace />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
