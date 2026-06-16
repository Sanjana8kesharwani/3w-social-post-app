import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, Button, TextField, Typography, Box, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login, user, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/feed');
    }
  }, [user, navigate]);

  const validate = () => {
    let valid = true;
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await login(email, password);
    if (result && result.success) {
      navigate('/feed');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Card variant="outlined" sx={{ borderRadius: 2, backgroundColor: '#ffffff' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
            SocialFeed
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Log in to your account
          </Typography>

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              disabled={loading}
              autoComplete="email"
              size="small"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              disabled={loading}
              autoComplete="current-password"
              size="small"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 3, mb: 2, textTransform: 'none', py: 1, borderRadius: 1.5, fontWeight: 600 }}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link to="/signup" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 600 }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
