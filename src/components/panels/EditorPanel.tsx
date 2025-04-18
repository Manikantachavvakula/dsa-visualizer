import React from 'react';
import { 
  Box, 
  TextField, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl,
  Typography
} from '@mui/material';

interface EditorPanelProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  darkMode?: boolean;
  sx?: any;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ 
  code, 
  language, 
  onCodeChange, 
  onLanguageChange,
  darkMode = false,
  sx 
}) => {
  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
  ];

  return (
    <Box sx={{ 
      ...sx, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
    }}>
      <FormControl fullWidth size="small">
        <InputLabel sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : undefined }}>
          Language
        </InputLabel>
        <Select
          value={language}
          label="Language"
          onChange={(e) => onLanguageChange(e.target.value)}
          sx={{
            color: darkMode ? 'white' : undefined,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : undefined,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : undefined,
            },
          }}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.value} value={lang.value}>
              <Typography sx={{ color: darkMode ? 'white' : undefined }}>
                {lang.label}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        multiline
        minRows={10}
        maxRows={20}
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        variant="outlined"
        sx={{
          flex: 1,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : undefined,
            },
            '&:hover fieldset': {
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : undefined,
            },
          },
          '& textarea': {
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            color: darkMode ? 'white' : undefined,
            bgcolor: darkMode ? '#1e1e1e' : undefined,
          }
        }}
      />
    </Box>
  );
};

export default EditorPanel;