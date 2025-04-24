// src/components/editor/Editor.tsx

import React, { useEffect, useRef } from 'react';
import AceEditor from 'react-ace';

// Import ace modes and themes
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

import { Box, Paper } from '@mui/material';
import { Language } from '../../types/types';

const getExampleCode = (language: Language): string => {
  const examples = {
    'python': `# Python example
n = int(input("Enter a number (n): "))

for i in range(1, n + 1):
    print(f"Table of {i}:")
    for j in range(1, 11):
        print(f"{i} x {j} = {i * j}")
    print()`,
    
    'java': `// Java example
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter a number (n): ");
        int n = scanner.nextInt();
        
        for (int i = 1; i <= n; i++) {
            System.out.println("Table of " + i + ":");
            for (int j = 1; j <= 10; j++) {
                System.out.println(i + " x " + j + " = " + (i * j));
            }
            System.out.println();
        }
    }
}`,
    
    'cpp': `// C++ example
#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter a number (n): ";
    cin >> n;
    
    for (int i = 1; i <= n; i++) {
        cout << "Table of " << i << ":" << endl;
        for (int j = 1; j <= 10; j++) {
            cout << i << " x " << j << " = " << (i * j) << endl;
        }
        cout << endl;
    }
    
    return 0;
}`,
    
    'csharp': `// C# example
using System;

class Program {
    static void Main() {
        Console.Write("Enter a number (n): ");
        int n = Convert.ToInt32(Console.ReadLine());
        
        for (int i = 1; i <= n; i++) {
            Console.WriteLine($"Table of {i}:");
            for (int j = 1; j <= 10; j++) {
                Console.WriteLine($"{i} x {j} = {i * j}");
            }
            Console.WriteLine();
        }
    }
}`
  };

  return examples[language];
};

const getMode = (language: Language): string => {
  const modes: Record<Language, string> = {
    'python': 'python',
    'java': 'java',
    'cpp': 'c_cpp',
    'csharp': 'csharp'
  };
  return modes[language];
};

interface EditorProps {
  language: Language;
  code: string;
  setCode: (code: string) => void;
  theme: string;
}

const Editor: React.FC<EditorProps> = ({ language, code, setCode, theme }) => {
  const editorRef = useRef<AceEditor>(null);
  
  useEffect(() => {
    // When language changes, set example code if current code is empty
    if (!code || code === getExampleCode(language === 'python' ? 'java' : 'python')) {
      setCode(getExampleCode(language));
    }
  }, [language]);

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <Paper elevation={0} sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
        <AceEditor
          ref={editorRef}
          mode={getMode(language)}
          theme={theme}
          name="code-editor"
          onChange={setCode}
          value={code}
          fontSize={14}
          width="100%"
          height="100%"
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </Paper>
    </Box>
  );
};

export default Editor;