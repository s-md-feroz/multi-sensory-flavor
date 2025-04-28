
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Ingredient } from '@/utils/flavorEngine';

interface FlavorProfileChartProps {
  ingredients: Ingredient[];
}

const FlavorProfileChart = ({ ingredients }: FlavorProfileChartProps) => {
  const calculateSensoryData = () => {
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
        value: ingredients.length > 0 ? (sensoryCount.Taste / ingredients.length) * 100 : 0,
      },
      {
        category: 'Smell',
        value: ingredients.length > 0 ? (sensoryCount.Smell / ingredients.length) * 100 : 0,
      },
      {
        category: 'Texture',
        value: ingredients.length > 0 ? (sensoryCount.Texture / ingredients.length) * 100 : 0,
      },
      {
        category: 'Sound',
        value: ingredients.length > 0 ? (sensoryCount.Sound / ingredients.length) * 100 : 0,
      },
      {
        category: 'Visual',
        value: ingredients.length > 0 ? (sensoryCount.Visual / ingredients.length) * 100 : 0,
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

  return (
    <div className="w-full h-[300px] mt-4">
      <ChartContainer config={chartConfig}>
        <RadarChart data={calculateSensoryData()} className="w-full h-full">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="category" />
          <Radar
            name="Sensory Profile"
            dataKey="value"
            stroke="var(--color-radar)"
            fill="var(--color-radar)"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ChartContainer>
    </div>
  );
};

export default FlavorProfileChart;
