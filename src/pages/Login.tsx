import React from 'react';
import {
  Container, Box, Avatar, Typography, TextField, Button, Link,
  InputAdornment, IconButton
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon, Visibility, VisibilityOff, Email as EmailIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/Dashboard');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <img src="https://placehold.co/60x60" alt="Company Logo" />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
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
            sx={{ mt: 3, mb: 2, bgcolor: 'primary.main' }}
            onClick={handleLogin}
          >
            Sign In
          </Button>
          <Link href="#" variant="body2" sx={{ display: 'block', textAlign: 'center' }}>
            Forgot password?
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
