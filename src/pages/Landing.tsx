import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReguhubLogoV from '../assets/ReguhubLogoV.svg';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleDemo = () => {
    // This will be implemented in the next step
    navigate('/demo-login');
  };

  const handleUseApp = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F4F4F4',
      }}
    >
      <Paper elevation={3} sx={{ p: 6, borderRadius: 4, textAlign: 'center', minWidth: 350 }}>
        <Box mb={3}>
          <img src={ReguhubLogoV} alt="Reguhub Logo" style={{ height: 60, marginBottom: 16 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome to Reguhub
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Choose how you want to explore the app
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" gap={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleDemo}
            sx={{ borderRadius: 2 }}
          >
            Demo
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleUseApp}
            sx={{ borderRadius: 2 }}
          >
            Use App
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Landing; 