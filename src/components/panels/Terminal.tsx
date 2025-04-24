// src/components/panels/Terminal.tsx

import React, { useEffect, useRef } from 'react';
import { Box, InputBase } from '@mui/material';
import { styled } from '@mui/material/styles';

interface TerminalProps {
  output: string[];
  sendInput: (input: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  theme: 'light' | 'dark';
}

const TerminalContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? '#0c0c0c' : '#f8f8f8',
}));

const TerminalOutput = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(1),
  fontFamily: 'Consolas, monospace',
  fontSize: '14px',
  whiteSpace: 'pre-wrap',
  color: theme.palette.mode === 'dark' ? '#cccccc' : '#333333',
}));

const TerminalInputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#0c0c0c' : '#f8f8f8',
}));

const TerminalPrefix = styled(Box)(({ theme }) => ({
  color: '#0f0',
  fontFamily: 'Consolas, monospace',
  paddingRight: theme.spacing(0.5),
  display: 'flex',
  alignItems: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flex: 1,
  fontFamily: 'Consolas, monospace',
  color: theme.palette.mode === 'dark' ? '#cccccc' : '#333333',
}));

const Terminal: React.FC<TerminalProps> = ({ output, sendInput, inputRef, theme }) => {
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && inputRef.current) {
      sendInput(inputRef.current.value);
    }
  };

  return (
    <TerminalContainer>
      <TerminalOutput ref={outputRef}>
        {output.map((line, index) => {
          let color = 'inherit';
          if (line.startsWith('Error:')) color = '#ff5252';
          if (line.startsWith('>')) color = '#66bb6a';
          if (line.includes('Running code...')) color = '#42a5f5';

          return (
            <Box key={index} sx={{ color }}>
              {line}
            </Box>
          );
        })}
      </TerminalOutput>
      
      <TerminalInputContainer>
        <TerminalPrefix>{'>'}</TerminalPrefix>
        <StyledInputBase
          inputRef={inputRef}
          placeholder="Enter input here..."
          onKeyDown={handleKeyDown}
          fullWidth
        />
      </TerminalInputContainer>
    </TerminalContainer>
  );
};

export default Terminal;