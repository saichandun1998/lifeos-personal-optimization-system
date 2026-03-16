import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Handle OAuth callback — Supabase redirects with tokens in hash fragment
// which conflicts with HashRouter. Detect and clean up before React renders.
const rawHash = window.location.hash;
if (rawHash && rawHash.includes('access_token') && !rawHash.startsWith('#/')) {
  // Store tokens so Supabase SDK can find them, then redirect to /app
  const tokenPart = rawHash.substring(1); // remove leading #
  sessionStorage.setItem('supabase-auth-token-fragment', tokenPart);
  window.history.replaceState(null, '', window.location.pathname + '#/app');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
