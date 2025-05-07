
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Ingredient } from '@/utils/flavor';

interface FlavorProfileChartProps {
  ingredients: Ingredient[];
}

const FlavorProfileChart = ({ ingredients }: FlavorProfileChartProps) => {
  // Calculate sensory profile data for the radar chart
  const calculateSensoryData = () => {
    if (ingredients.length === 0) {
      return [
        { category: 'Taste', value: 0 },
        { category: 'Smell', value: 0 },
        { category: 'Texture', value: 0 },
        { category: 'Sound', value: 0 },
        { category: 'Visual', value: 0 },
      ];
    }
    
    const sensoryCount = {
      Taste: ingredients.reduce((acc, ing) => acc + ing.taste.length, 0),
      Smell: ingredients.reduce((acc, ing) => acc + ing.smell.length, 0),
      Texture: ingredients.reduce((acc, ing) => acc + ing.texture.length, 0),
      Sound: ingredients.reduce((acc, ing) => acc + ing.sound.length, 0),
      Visual: ingredients.reduce((acc, ing) => acc + ing.visual.length, 0),
    };

    return [
      {
        category: 'Taste',
        value: (sensoryCount.Taste / ingredients.length) * 100,
      },
      {
        category: 'Smell',
        value: (sensoryCount.Smell / ingredients.length) * 100,
      },
      {
        category: 'Texture',
        value: (sensoryCount.Texture / ingredients.length) * 100,
      },
      {
        category: 'Sound',
        value: (sensoryCount.Sound / ingredients.length) * 100,
      },
      {
        category: 'Visual',
        value: (sensoryCount.Visual / ingredients.length) * 100,
      },
    ];
  };

  const chartConfig = {
    radar: {
      theme: {
        light: "#9b87f5",
        dark: "#7E69AB"
      }
    }
  };

  // If no ingredients are selected, don't render the chart
  if (ingredients.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-[300px] border border-border/50 rounded-lg p-4 bg-card/50">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={calculateSensoryData()}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="category" />
            <Radar
              name="Sensory Profile"
              dataKey="value"
              stroke="var(--color-radar)"
              fill="var(--color-radar)"
              fillOpacity={0.3}
            />
            <Tooltip content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const value = payload[0].value;
                const formattedValue = typeof value === 'number' ? value.toFixed(1) : value;
                return (
                  <div className="bg-background p-2 border border-border rounded-md shadow-md">
                    <p className="font-medium">{payload[0].payload.category}</p>
                    <p className="text-sm">{`Value: ${formattedValue}%`}</p>
                  </div>
                );
              }
              return null;
            }} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default FlavorProfileChart;
