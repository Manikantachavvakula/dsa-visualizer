import React from 'react';
import { Box, Typography } from '@mui/material';

interface OutputPanelProps {
  output: string;
  darkMode?: boolean;
  sx?: any;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ output, darkMode = false, sx }) => {
  return (
    <Box sx={{ 
      ...sx,
      whiteSpace: 'pre-wrap',
      fontFamily: 'monospace',
      fontSize: '0.875rem',
      bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
      color: darkMode ? '#ffffff' : undefined,
    }}>
      <Typography component="div" sx={{ color: darkMode ? 'inherit' : undefined }}>
        {output || 'Output will appear here...'}
      </Typography>
    </Box>
  );
};

export default OutputPanel;