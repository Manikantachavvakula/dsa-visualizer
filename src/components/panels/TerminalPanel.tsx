import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';

interface TerminalPanelProps {
  onSubmit: (input: string) => void;
  prompt?: string;
  disabled?: boolean;
  darkMode?: boolean;
  sx?: any;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ 
  onSubmit, 
  prompt = '>>>', 
  disabled = false,
  darkMode = false,
  sx 
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <Box sx={{ 
      ...sx,
      bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
    }}>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 1,
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
        }}
      >
        {prompt}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={disabled ? "Run code to enable terminal..." : "Type input here..."}
          variant="outlined"
          size="small"
          disabled={disabled}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : undefined,
              },
              '&:hover fieldset': {
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : undefined,
              },
            },
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: darkMode ? 'white' : undefined,
              bgcolor: darkMode ? '#1e1e1e' : undefined,
            }
          }}
        />
      </form>
    </Box>
  );
};

export default TerminalPanel;