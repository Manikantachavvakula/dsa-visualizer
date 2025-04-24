// src/api/API.ts

import { ExecutionResult, ApiResponse, CodeAnalysis } from '../types/types';

const API_URL = 'http://localhost:8000';

export class API {
  static async runCode(code: string, language: string): Promise<ExecutionResult> {
    try {
      const response = await fetch(`${API_URL}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `code=${encodeURIComponent(code)}&language=${language}`
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error running code:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  static async analyzeCode(code: string, language: string): Promise<CodeAnalysis> {
    try {
      // This would connect to a backend endpoint for code analysis
      // For now, mocking a simple response based on code length
      const complexity = code.length < 100 ? 'O(1)' : code.length < 500 ? 'O(n)' : 'O(n²)';
      
      // Count loops as a basic metric
      const loopCount = (code.match(/for|while/g) || []).length;
      
      return {
        complexity,
        metrics: {
          loops: loopCount
        }
      };
    } catch (error) {
      console.error('Error analyzing code:', error);
      return {
        complexity: 'Unknown',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static createWebSocket(): WebSocket {
    const socket = new WebSocket(`ws://localhost:8000/terminal`);
    
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return socket;
  }
  
  // Mock method to simulate step-by-step execution
  // In a real implementation, this would connect to your backend
  static async getExecutionSteps(code: string, language: string): Promise<ExecutionResult> {
    // Simple mock implementation for demonstration
    if (language === 'python' && code.includes('range')) {
      return {
        steps: [
          {
            line: 2,
            description: "Input request",
            variables: {"n": {value: "3", type: "int"}},
            output: "Enter a number (n): 3"
          },
          {
            line: 4,
            description: "First iteration of outer loop",
            variables: {"n": {value: "3", type: "int"}, "i": {value: "1", type: "int"}},
            output: "Table of 1:"
          },
          {
            line: 6,
            description: "Inner loop (i=1, j=1)",
            variables: {"n": {value: "3", type: "int"}, "i": {value: "1", type: "int"}, "j": {value: "1", type: "int"}},
            output: "1 x 1 = 1"
          },
          // Additional steps would be here
        ]
      };
    }
    
    // Default simple steps
    return {
      steps: [
        {
          line: 1,
          description: "Code initialization",
          variables: {},
          output: ""
        },
        {
          line: 2,
          description: "Variables definition",
          variables: {"sample": {value: "example", type: "string"}},
          output: ""
        }
      ]
    };
  }
}

export default API;