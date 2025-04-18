import React, { useState, useMemo, useEffect } from 'react';
import { 
  Box, 
  Button, 
  IconButton,
  CssBaseline,
  ThemeProvider,
  createTheme,
  PaletteMode,
  Typography,
  Chip,
  Paper,
  Tooltip
} from '@mui/material';
import { Brightness4, Brightness7, Info } from '@mui/icons-material';
import EditorPanel from './components/panels/EditorPanel';
import OutputPanel from './components/panels/OutputPanel';
import TerminalPanel from './components/panels/TerminalPanel';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const App = () => {
  // Theme state
  const [mode, setMode] = useState<PaletteMode>('light');
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
          }
        : {
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
            text: {
              primary: '#ffffff',
              secondary: 'rgba(255, 255, 255, 0.7)',
            },
          }),
    },
  }), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Editor state
  const [code, setCode] = useState(
    `# Fibonacci Sequence\n` +
    `n = int(input("Enter number of terms: "))\n` +
    `first, second = 0, 1\n` +
    `print("Fibonacci Sequence:")\n` +
    `for i in range(n):\n` +
    `    print(first, end=" ")\n` +
    `    first, second = second, first + second`
  );
  const [language, setLanguage] = useState('python');
  
  // Execution state
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [awaitingInput, setAwaitingInput] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');

  // Visualization state
  const [visualizationData, setVisualizationData] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [complexityData, setComplexityData] = useState<any[]>([]);
  const [timeComplexity, setTimeComplexity] = useState('O(1)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(1)');
  const [showComplexityGraph, setShowComplexityGraph] = useState(false);

  // Analyze complexity whenever code changes
  useEffect(() => {
    analyzeComplexity();
  }, [code]);

  const analyzeComplexity = () => {
    // Time complexity analysis
    if (code.includes('for i in range(n):\n    for j in range(n):')) {
      setTimeComplexity('O(n²)');
    } else if (code.includes('for i in range(n):')) {
      setTimeComplexity('O(n)');
    } else if (code.includes('while n > 0:\n    n = n // 2')) {
      setTimeComplexity('O(log n)');
    } else {
      setTimeComplexity('O(1)');
    }

    // Space complexity analysis
    if (code.includes('arr = [0] * n')) {
      setSpaceComplexity('O(n)');
    } else if (code.includes('first, second = 0, 1')) {
      setSpaceComplexity('O(1)');
    } else {
      setSpaceComplexity('O(1)');
    }

    setComplexityData(generateComplexityData(code));
  };

  const generateComplexityData = (algorithm: string) => {
    const data = [];
    const maxSize = 20;
    
    for (let n = 1; n <= maxSize; n++) {
      let operations;
      
      if (algorithm.includes('for i in range(n):\n    for j in range(n):')) {
        operations = n * n; // O(n²)
      } else if (algorithm.includes('for i in range(n):')) {
        operations = n; // O(n)
      } else if (algorithm.includes('while n > 0:\n    n = n // 2')) {
        operations = Math.log2(n); // O(log n)
      } else {
        operations = 1; // O(1)
      }
      
      data.push({
        size: n,
        operations,
        'O(n)': n,
        'O(log n)': Math.log2(n),
        'O(n²)': n * n,
        'O(1)': 1
      });
    }
    
    return data;
  };

  const handleExecute = () => {
    setIsVisualizing(false);
    setShowComplexityGraph(false);
    setIsExecuting(true);
    setOutput('Executing code...\n');
    setAwaitingInput(true);
    setInputPrompt('Enter number of terms: ');
  };

  const handleVisualize = () => {
    if (code.includes('Fibonacci')) {
      const steps = [];
      let first = 0, second = 1;
      const n = 10; // Default steps for visualization
      
      for (let i = 0; i < n; i++) {
        steps.push({
          iteration: i,
          first,
          second,
          next: first + second
        });
        [first, second] = [second, first + second];
      }
      
      setVisualizationData(steps);
      setCurrentStep(0);
      setIsVisualizing(true);
      setShowComplexityGraph(false);
      setOutput('Prepared visualization (10 steps)\n');
    } else {
      setOutput('Visualization only available for Fibonacci sequence\n');
    }
  };

  const handleShowComplexity = () => {
    setShowComplexityGraph(!showComplexityGraph);
    setIsVisualizing(false);
  };

  const handleTerminalSubmit = (input: string) => {
    if (!isExecuting) return;
    
    setOutput(prev => prev + input + '\n');
    
    try {
      const n = parseInt(input);
      if (isNaN(n)) {
        setOutput(prev => prev + 'Error: Please enter a valid number\n');
        return;
      }

      if (code.includes('Fibonacci')) {
        let result = 'Fibonacci Sequence:\n';
        let first = 0, second = 1;
        for (let i = 0; i < n; i++) {
          result += `${first} `;
          [first, second] = [second, first + second];
        }
        setOutput(prev => prev + result + '\n');
      } else {
        setOutput(prev => prev + `Executed with input: ${n}\n`);
      }

      setIsExecuting(false);
      setAwaitingInput(false);
    } catch (error) {
      setOutput(prev => prev + `Error: ${error}\n`);
      setIsExecuting(false);
      setAwaitingInput(false);
    }
  };

  const getComplexityExplanation = () => {
    return (
      <Box sx={{ p: 1 }}>
        <Typography variant="body2" gutterBottom>
          <strong>Time Complexity ({timeComplexity}):</strong> 
          {timeComplexity === 'O(1)' ? ' Constant time (fastest)' :
           timeComplexity === 'O(log n)' ? ' Logarithmic time (very fast)' :
           timeComplexity === 'O(n)' ? ' Linear time (fast for small n)' : ' Quadratic time (slow for large n)'}
        </Typography>
        <Typography variant="body2">
          <strong>Space Complexity ({spaceComplexity}):</strong> 
          {spaceComplexity === 'O(1)' ? ' Constant space (most efficient)' : ' Linear space (uses more memory)'}
        </Typography>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        gap: 2,
        boxSizing: 'border-box',
        bgcolor: 'background.default',
      }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Code Run</Typography>
          <IconButton onClick={toggleColorMode} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        {/* Complexity Display */}
        <Paper elevation={1} sx={{ 
          p: 2, 
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Time Complexity</Typography>
              <Chip 
                label={timeComplexity} 
                color={
                  timeComplexity === 'O(1)' ? 'success' :
                  timeComplexity === 'O(log n)' ? 'info' :
                  timeComplexity === 'O(n)' ? 'warning' : 'error'
                }
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Space Complexity</Typography>
              <Chip 
                label={spaceComplexity} 
                color={
                  spaceComplexity === 'O(1)' ? 'success' : 'warning'
                }
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
          </Box>
          <Tooltip title={getComplexityExplanation()} arrow>
            <IconButton>
              <Info fontSize="small" />
            </IconButton>
          </Tooltip>
        </Paper>

        {/* Control Bar */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleExecute} 
            disabled={isExecuting}
            sx={{ flex: 1 }}
          >
            Execute
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleVisualize} 
            disabled={isExecuting}
            sx={{ flex: 1 }}
          >
            Visualize
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleShowComplexity}
            color={showComplexityGraph ? 'secondary' : 'primary'}
            sx={{ flex: 1 }}
          >
            {showComplexityGraph ? 'Hide Complexity' : 'Show Complexity'}
          </Button>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'flex', flex: 1, gap: 2, minHeight: 0 }}>
          {/* Editor Panel */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <EditorPanel
              code={code}
              language={language}
              onCodeChange={setCode}
              onLanguageChange={setLanguage}
              darkMode={mode === 'dark'}
              sx={{
                flex: 1,
                borderRadius: 1,
                boxShadow: 1,
                overflow: 'auto'
              }}
            />
          </Box>

          {/* Output Area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <OutputPanel
              output={
                isVisualizing
                  ? `Fibonacci Visualization (Step ${currentStep + 1}):\n` +
                    `Iteration: ${visualizationData[currentStep]?.iteration}\n` +
                    `first = ${visualizationData[currentStep]?.first}\n` +
                    `second = ${visualizationData[currentStep]?.second}\n` +
                    `next = ${visualizationData[currentStep]?.next}`
                  : output
              }
              darkMode={mode === 'dark'}
              sx={{
                flex: showComplexityGraph ? 0.5 : 1,
                borderRadius: 1,
                boxShadow: 1,
                overflow: 'auto',
                p: 2
              }}
            />

            {/* Complexity Graph */}
            {showComplexityGraph && (
              <Paper elevation={1} sx={{ 
                flex: 0.5,
                bgcolor: 'background.paper',
                borderRadius: 1,
                p: 2,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Typography variant="subtitle2" gutterBottom>
                  Time Complexity Analysis
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complexityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="size" name="Input Size" />
                      <YAxis name="Operations" />
                      <RechartsTooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="operations" 
                        stroke="#8884d8" 
                        name="Actual Operations"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={timeComplexity} 
                        stroke="#ff0000" 
                        name={`Expected ${timeComplexity}`}
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            )}

            {/* Visualization Controls */}
            {isVisualizing && (
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                alignItems: 'center',
                bgcolor: 'background.paper',
                borderRadius: 1,
                p: 2,
                boxShadow: 1
              }}>
                <Button 
                  variant="outlined"
                  onClick={() => setCurrentStep(p => Math.max(0, p - 1))}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Typography sx={{ flex: 1, textAlign: 'center' }}>
                  Step {currentStep + 1} of {visualizationData.length}
                </Typography>
                <Button 
                  variant="outlined"
                  onClick={() => setCurrentStep(p => Math.min(visualizationData.length - 1, p + 1))}
                  disabled={currentStep === visualizationData.length - 1}
                >
                  Next
                </Button>
              </Box>
            )}

            <TerminalPanel
              onSubmit={handleTerminalSubmit}
              prompt={inputPrompt}
              disabled={!awaitingInput}
              darkMode={mode === 'dark'}
              sx={{
                borderRadius: 1,
                boxShadow: 1,
                p: 2
              }}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;