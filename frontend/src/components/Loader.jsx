import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Loader = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="200px"
      width="100%"
    >
      <CircularProgress size={40} thickness={4} />
    </Box>
  );
};

export default Loader;
