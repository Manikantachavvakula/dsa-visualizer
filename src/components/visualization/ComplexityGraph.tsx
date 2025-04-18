import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ComplexityGraphProps {
  data?: {
    bestCase?: { time?: string; space?: string };
    averageCase?: { time?: string; space?: string };
    worstCase?: { time?: string; space?: string };
  };
}

export default function ComplexityGraph({ data }: ComplexityGraphProps) {
  const chartData = [
    { name: 'Best', ...data?.bestCase },
    { name: 'Avg', ...data?.averageCase },
    { name: 'Worst', ...data?.worstCase }
  ];

  return (
    <LineChart width={600} height={300} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis label={{ value: 'Operations', angle: -90 }} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="time" stroke="#8884d8" name="Time Complexity" />
      <Line type="monotone" dataKey="space" stroke="#82ca9d" name="Space Complexity" />
    </LineChart>
  );
}