// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
    <div className="app">
          <Header />

      <Routes>
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
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route 
              path="/projects" 
              element={
                <ProtectedRoute>
                  <ProjectIndex />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/organisation" 
              element={
                <ProtectedRoute>
                  <Organisation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workers" 
              element={
                <ProtectedRoute>
                  <Workers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/safetyindex/:id" 
              element={
                <ProtectedRoute>
                  <SafetyIndex />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
