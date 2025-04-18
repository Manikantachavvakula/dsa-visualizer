import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
}

const Editor = ({ code, language, onCodeChange }: EditorProps) => (
  <MonacoEditor
    height="100%"
    language={language}
    theme="vs-dark"
    value={code}
    onChange={(value) => onCodeChange(value || '')}
    options={{
      minimap: { enabled: false },
      fontSize: 14,
      automaticLayout: true
    }}
  />
);

export default Editor;