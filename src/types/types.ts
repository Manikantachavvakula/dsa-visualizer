// src/types/types.ts

export type Language = 'python' | 'java' | 'cpp' | 'csharp';

export interface CodeAnalysis {
  complexity: string;
  metrics?: {
    loops?: number;
    conditionals?: number;
    functionCalls?: number;
    [key: string]: any;
  };
  error?: string;
}

export interface ExecutionResult {
  output?: string;
  error?: string;
  analysis?: CodeAnalysis;
  steps?: ExecutionStep[];
}

export interface ExecutionStep {
  line: number;
  description: string;
  variables: {
    [key: string]: {
      value: any;
      type: string;
    }
  };
  output?: string;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}