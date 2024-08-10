// src/components/Header.tsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { Avatar, Box, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {

  const navigate = useNavigate();

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };
  
  return (
    
<Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="default">
          <Toolbar>
          <Avatar 
              alt="Logo" 
              src="https://placehold.co/40x40" 
              sx={{ cursor: 'pointer' }} 
              onClick={handleNavigateToDashboard}
            />
            <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: 2 }}>
              ReguHub HSE
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <InputBase
                placeholder="Search…"
                startAdornment={<SearchIcon />}
                sx={{ border: '1px solid gray', borderRadius: '4px', padding: '0 8px' }}
              />
            </Box>
            <Button variant="contained" color="primary" sx={{ marginLeft: 2 }}>
              Go to Projects
            </Button>
          </Toolbar>
        </AppBar>

        <Container sx={{ marginTop: 4 }}>
          <Grid container spacing={4}>
            {/* Your existing components go here */}
          </Grid>
        </Container>
      </Box>


  );
};

export default Header;
