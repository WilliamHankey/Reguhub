// src/components/Header.tsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { Avatar, Box, Grid, Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../assests/reguhublogo.svg";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  // Conditionally render the header only on the dashboard and project index pages
  if (location.pathname !== '/dashboard' && location.pathname !== '/projects') {
    return null;
  }

  return (
    <AppBar position="static" color="default" sx={{ backgroundColor: '#ffffff', boxShadow: 'none', borderBottom: '1px solid #e0e0e0', marginBottom: 0 }}>
      <Toolbar>
        <Avatar 
          alt="Logo" 
          src={logo}
          sx={{ cursor: 'pointer' }} 
          onClick={handleNavigateToDashboard}
        />
        <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: 2, color: '#333333' }}>
          ReguHub HSE
        </Typography>
        <Box sx={{ position: 'relative', marginRight: 2 }}>
          <InputBase
            placeholder="Search…"
            startAdornment={<SearchIcon sx={{ color: '#333333' }} />}
            sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '0 8px' }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Avatar alt="John Duppie" src="https://www.w3schools.com/w3images/avatar4.png" />
          <Box sx={{ marginLeft: 1, textAlign: 'right' }}>
            <Typography variant="subtitle1" sx={{ color: '#333333' }}>
              John Duppie
            </Typography>
            <Typography variant="body2" sx={{ color: '#999999' }}>
              johnduppie@mail.com
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;