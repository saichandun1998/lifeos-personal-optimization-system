import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Schedule from './pages/dashboard/Schedule';
import Habits from './pages/dashboard/Habits';
import Radar from './pages/dashboard/Radar';
import Notes from './pages/dashboard/Notes';
import Decide from './pages/dashboard/Decide';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Dashboard */}
      <Route path="/app" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="habits" element={<Habits />} />
        <Route path="radar" element={<Radar />} />
        <Route path="notes" element={<Notes />} />
        <Route path="decide" element={<Decide />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
