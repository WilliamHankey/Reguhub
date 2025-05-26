// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './config/theme';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import ProjectIndex from './pages/ProjectIndex';
import Organisation from './pages/Organisation';
import Workers from './pages/Workers';
import ProjectDetails from './pages/ProjectDetails';
import SafetyIndex from './pages/SafetyIndex';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import DemoLogin from './pages/DemoLogin';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  let headerProps = {};
  if (location.pathname === '/login' || location.pathname === '/register') {
    headerProps = { hide: true };
  } else if (location.pathname === '/organisation' || location.pathname === '/workers') {
    headerProps = { logoOnly: true };
  }
  return (
    <div className="app">
      <Header {...headerProps} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/demo-login" element={<DemoLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/projects" element={<ProtectedRoute><ProjectIndex /></ProtectedRoute>} />
        <Route path="/organisation" element={<ProtectedRoute><Organisation /></ProtectedRoute>} />
        <Route path="/workers" element={<ProtectedRoute><Workers /></ProtectedRoute>} />
        <Route path="/safetyindex/:id" element={<ProtectedRoute><SafetyIndex /></ProtectedRoute>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    </Router>
  );
};

export default App;
