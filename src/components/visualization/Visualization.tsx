// src/components/visualization/Visualization.tsx

import React, { useEffect, useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { ExecutionStep, CodeAnalysis } from '../../types/types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VisualizationProps {
  complexity: CodeAnalysis;
  steps: ExecutionStep[];
  theme: 'light' | 'dark';
}

const Visualization: React.FC<VisualizationProps> = ({ complexity, steps, theme }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Input Size'
        }
      }
    }
  });

  // Update chart based on complexity
  useEffect(() => {
    const labels = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
    let data;
    let borderColor;
    let backgroundColor;

    switch (complexity.complexity) {
      case 'O(1)':
        data = Array(10).fill(1);
        borderColor = '#4caf50';
        backgroundColor = 'rgba(76, 175, 80, 0.2)';
        break;
      case 'O(n)':
        data = Array.from({ length: 10 }, (_, i) => i + 1);
        borderColor = '#2196f3';
        backgroundColor = 'rgba(33, 150, 243, 0.2)';
        break;
      case 'O(n²)':
        data = Array.from({ length: 10 }, (_, i) => (i + 1) * (i + 1));
        borderColor = '#ff9800';
        backgroundColor = 'rgba(255, 152, 0, 0.2)';
        break;
      default:
        data = Array.from({ length: 10 }, (_, i) => i + 1);
        borderColor = '#9c27b0';
        backgroundColor = 'rgba(156, 39, 176, 0.2)';
    }

    setChartData({
      labels,
      datasets: [
        {
          label: complexity.complexity,
          data,
          borderColor,
          backgroundColor,
          tension: 0.1
        }
      ]
    });

    // Update chart options for theme
    setChartOptions(prev => ({
      ...prev,
      scales: {
        ...prev.scales,
        y: {
          ...prev.scales?.y,
          grid: {
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: theme === 'dark' ? '#cccccc' : '#333333'
          }
        },
        x: {
          ...prev.scales?.x,
          grid: {
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: theme === 'dark' ? '#cccccc' : '#333333'
          }
        }
      }
    }));
  }, [complexity, theme]);

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Time Complexity
        </Typography>
        <Chip 
          label={complexity.complexity} 
          color={
            complexity.complexity === 'O(1)' ? 'success' : 
            complexity.complexity === 'O(n)' ? 'primary' : 
            complexity.complexity === 'O(n²)' ? 'warning' : 'secondary'
          }
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ height: 250 }}>
          {chartData && (
            <Line options={chartOptions} data={chartData} />
          )}
        </Box>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>
          Step by Step Execution
        </Typography>
        
        {steps.length > 0 ? (
          steps.map((step, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  Step {index + 1}: {step.description} (Line {step.line})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle2" gutterBottom>
                  Variables:
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(step.variables).map(([name, details], idx) => (
                      <TableRow key={idx}>
                        <TableCell>{name}</TableCell>
                        <TableCell>{String(details.value)}</TableCell>
                        <TableCell>{details.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {step.output && (
                  <>
                    <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                      Output:
                    </Typography>
                    <Box 
                      sx={{ 
                        p: 1, 
                        bgcolor: theme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                        borderRadius: 1,
                        fontFamily: 'monospace'
                      }}
                    >
                      {step.output}
                    </Box>
                  </>
                )}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography color="text.secondary">
            Run your code and select "Step by Step" to see execution visualization.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Visualization;