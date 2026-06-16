import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold', color: '#1976d2', cursor: 'pointer' }}
            onClick={() => navigate('/feed')}
          >
            SocialFeed
          </Typography>

          {user && (
            <Box display="flex" alignItems="center" gap={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32, fontSize: '0.95rem', fontWeight: 'bold' }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body1" sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
                  {user.username}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
