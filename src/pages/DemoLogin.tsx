import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Typography, Button, Alert } from '@mui/material';
import { supabase } from '../utils/supabaseClient';

const DEMO_EMAIL = 'demo@reguhub.com';
const DEMO_PASSWORD = 'demo1234';

const DemoLogin: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loginDemo = async () => {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });
      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    };
    loginDemo();
  }, [navigate]);

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/')}>Back to Landing</Button>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
      <CircularProgress />
      <Typography variant="h6" mt={2}>Logging you in to the demo...</Typography>
    </Box>
  );
};

export default DemoLogin; 