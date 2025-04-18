import React from 'react';
import { Stepper, Step, StepLabel, Paper, Typography } from '@mui/material';

interface ExecutionStep {
  line: number;
  code: string;
  variables: Record<string, any>;
}

interface ExecutionVisualizerProps {
  steps?: ExecutionStep[];
}

export default function ExecutionVisualizer({ steps }: ExecutionVisualizerProps) {
  return (
    <Stepper orientation="vertical">
      {steps?.map((step: ExecutionStep, index: number) => (
        <Step key={index} active>
          <StepLabel>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography>Line {step.line}: {step.code}</Typography>
              <Typography color="text.secondary">
                Variables: {JSON.stringify(step.variables)}
              </Typography>
            </Paper>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}