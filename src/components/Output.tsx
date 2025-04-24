// src/components/Output.tsx

import React, { useEffect, useState, useRef } from 'react';
import { Paper, Box, Tabs, Tab, Typography } from '@mui/material';
import Terminal from './panels/Terminal';
import Visualization from './visualization/Visualization';
import API from '../api/API';
import { ExecutionResult, ExecutionStep, CodeAnalysis } from '../types/types';

interface OutputProps {
  code: string;
  language: string;
  runTrigger: number;
  theme: 'light' | 'dark';
}

const Output: React.FC<OutputProps> = ({ code, language, runTrigger, theme }) => {
  const [tabValue, setTabValue] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [complexity, setComplexity] = useState<CodeAnalysis>({ complexity: 'O(n)' });
  const [isRunning, setIsRunning] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = API.createWebSocket();
    
    ws.onmessage = (event) => {
      setTerminalOutput(prev => [...prev, event.data]);
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      // Try to reconnect after a delay
      setTimeout(() => {
        setWebsocket(API.createWebSocket());
      }, 3000);
    };
    
    setWebsocket(ws);
    
    // Clean up on unmount
    return () => {
      ws.close();
    };
  }, []);

  // Handle running code
  useEffect(() => {
    if (runTrigger > 0 && code.trim()) {
      runCode();
    }
  }, [runTrigger]);

  const runCode = async () => {
    setIsRunning(true);
    setTerminalOutput([]);
    setTabValue(0); // Switch to terminal tab
    
    // Append running message
    setTerminalOutput(prev => [...prev, 'Running code...']);
    
    try {
      // Run code via API
      const result = await API.runCode(code, language);
      
      // Display output
      if (result.output) {
        setTerminalOutput(prev => [...prev, result.output || '']);
      }
      
      // Show errors if any
      if (result.error) {
        setTerminalOutput(prev => [...prev, `Error: ${result.error}`]);
      }
      
      // Update complexity analysis
      const analysisResult = await API.analyzeCode(code, language);
      setComplexity(analysisResult);
      
      // Get execution steps
      const stepsResult = await API.getExecutionSteps(code, language);
      if (stepsResult.steps) {
        setExecutionSteps(stepsResult.steps);
      }
    } catch (error) {
      setTerminalOutput(prev => [...prev, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const sendTerminalInput = (input: string) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(input);
      setTerminalOutput(prev => [...prev, `> ${input}`]);
      
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } else {
      setTerminalOutput(prev => [...prev, 'Terminal not connected']);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: { xs: '100%', md: '40%' },
        height: { xs: '40%', md: 'auto' },
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        overflow: 'hidden',
        borderLeft: 1,
        borderColor: 'divider'
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Terminal" />
          <Tab label="Visualization" />
        </Tabs>
      </Box>
      
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: theme === 'dark' ? 'grey.900' : 'grey.50'
        }}
      >
        {tabValue === 0 && (
          <Terminal 
            output={terminalOutput} 
            sendInput={sendTerminalInput} 
            inputRef={inputRef} 
            theme={theme}
          />
        )}
        
        {tabValue === 1 && (
          <Visualization 
            complexity={complexity} 
            steps={executionSteps} 
            theme={theme}
          />
        )}
      </Box>
    </Paper>
  );
};

export default Output;