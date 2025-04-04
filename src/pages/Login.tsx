import React, { useState } from 'react';
import {
  Grid, Box, Avatar, Typography, TextField, Button, Link,
  InputAdornment, IconButton, Paper, CssBaseline, Alert, CircularProgress
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon, Visibility, VisibilityOff, Email as EmailIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import logo from "../assests/reguhublogo.svg";
import Background from '../assests/reguhub_bg.jpg';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('wchankey15@gmail.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Store the session
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('session', JSON.stringify(data.session));
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to connect to the authentication service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={6}
        md={7}
        sx={{
          backgroundImage: `url(${Background})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Right Column with Login Form */}
      <Grid item xs={12} sm={6} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'transparent' }}>
            <img src={logo} alt="Company Logo" style={{ width: '100%' }} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Register"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Login;
