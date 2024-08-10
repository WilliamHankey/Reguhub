// src/App.tsx
import React from 'react';
import { AppBar, Avatar, Box, Button, Container, Grid, InputBase, Toolbar, Typography } from '@mui/material';
import Header from './components/Header';
import OrganizationProjects from './components/OrganizationProjects';
import OrganizationWorkers from './components/OrganizationWorkers';
import ProjectFlow from './components/ProjectFlow';
import ProjectLog from './components/ProjectLog';
import ProjectIndex from './pages/ProjectIndex';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { Search as SearchIcon, AddCircle as AddCircleIcon } from '@mui/icons-material';
import Login from './pages/Login';
import Organisation from './pages/Organisation';
import Workers from './pages/Workers';

const App: React.FC = () => {
     
  return (
    <div className="app">
      
      <Header/>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectIndex />} />
        <Route path="/organisation" element={<Organisation />} />
        <Route path="/workers" element={<Workers />} />
      </Routes>
    </div>
 
  );
};

export default App;
