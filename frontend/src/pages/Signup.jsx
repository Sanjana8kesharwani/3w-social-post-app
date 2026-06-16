import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, Button, TextField, Typography, Box, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const { signup, user, loading } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
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

    if (!username.trim()) {
      setUsernameError('Username is required');
      valid = false;
    } else if (username.trim().length < 3) {
      setUsernameError('Username must be at least 3 characters');
      valid = false;
    } else {
      setUsernameError('');
    }

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

    const result = await signup(username.trim(), email, password);
    if (result && result.success) {
      navigate('/feed');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Card variant="outlined" sx={{ borderRadius: 2, backgroundColor: '#ffffff' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
            SocialFeed
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Create a new account
          </Typography>

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!usernameError}
              helperText={usernameError}
              disabled={loading}
              autoComplete="username"
              size="small"
            />
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
              autoComplete="new-password"
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
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 600 }}>
                Log In
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Signup;
