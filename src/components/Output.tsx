import React from 'react';
import { Typography, Paper } from '@mui/material';

interface OutputProps {
  results?: {
    output?: string;
    error?: string;
    analysis?: any;
    steps?: any[];
  };
}

export default function Output({ results }: OutputProps) {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      {results?.error ? (
        <Typography color="error">{results.error}</Typography>
      ) : (
        <pre>{results?.output || 'No output yet'}</pre>
      )}
    </Paper>
  );
}