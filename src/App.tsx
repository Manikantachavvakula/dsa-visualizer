// Let's start with the main app component structure
// src/App.tsx

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './theme';
import Editor from './components/editor/Editor';
import Output from './components/Output';
import { Box, AppBar, Toolbar, Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Language } from './types/types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState<string>('');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [runTrigger, setRunTrigger] = useState<number>(0);

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLanguageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLanguage(event.target.value as Language);
  };

  const handleRunCode = () => {
    setRunTrigger(prev => prev + 1);
  };

  const handleFullScreenToggle = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              CodeViz
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="language-select-label">Language</InputLabel>
              <Select
                labelId="language-select-label"
                value={language}
                label="Language"
                onChange={handleLanguageChange}
              >
                <MenuItem value="python">Python</MenuItem>
                <MenuItem value="java">Java</MenuItem>
                <MenuItem value="cpp">C++</MenuItem>
                <MenuItem value="csharp">C#</MenuItem>
              </Select>
            </FormControl>
            <Button color="inherit" onClick={handleRunCode}>Run</Button>
            <Button color="inherit" onClick={handleThemeToggle}>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>
            <Button color="inherit" onClick={handleFullScreenToggle}>
              {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            </Button>
          </Toolbar>
        </AppBar>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexGrow: 1,
            flexDirection: { xs: 'column', md: 'row' },
            ...(isFullScreen && {
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 1000,
              bgcolor: 'background.paper',
              pt: 8 // Space for the AppBar
            })
          }}
        >
          <Editor 
            language={language} 
            code={code} 
            setCode={setCode} 
            theme={theme === 'light' ? 'github' : 'monokai'} 
          />
          <Output 
            code={code} 
            language={language} 
            runTrigger={runTrigger} 
            theme={theme}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;