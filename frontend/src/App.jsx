import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Snackbar, Alert } from '@mui/material';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import ProtectedRoute from './components/ProtectedRoute';

// Standard light-themed Material UI custom theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#5c6bc0',
    },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const AppContent = () => {
  const { toast, handleCloseToast } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        {/* Redirect any other path to feed */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>

      {/* Global Snackbar Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <PostProvider>
          <Router>
            <AppContent />
          </Router>
        </PostProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
