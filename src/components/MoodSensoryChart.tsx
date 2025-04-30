
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { MoodCategory } from '@/utils/flavor';

interface MoodSensoryChartProps {
  moodCategory: MoodCategory;
}

// Sample data for different mood categories
const moodSensoryData: Record<MoodCategory, any[]> = {
  cozy: [
    { name: 'Sweet', value: 80 },
    { name: 'Warm', value: 95 },
    { name: 'Comforting', value: 90 },
    { name: 'Spiced', value: 75 },
    { name: 'Rich', value: 70 },
  ],
  adventurous: [
    { name: 'Unexpected', value: 90 },
    { name: 'Bold', value: 85 },
    { name: 'Contrast', value: 80 },
    { name: 'Complex', value: 75 },
    { name: 'Surprising', value: 95 },
  ],
  refreshing: [
    { name: 'Bright', value: 90 },
    { name: 'Crisp', value: 85 },
    { name: 'Citrus', value: 80 },
    { name: 'Cool', value: 75 },
    { name: 'Light', value: 70 },
  ],
  romantic: [
    { name: 'Indulgent', value: 85 },
    { name: 'Aromatic', value: 80 },
    { name: 'Silky', value: 90 },
    { name: 'Floral', value: 75 },
    { name: 'Rich', value: 70 },
  ],
  energizing: [
    { name: 'Zippy', value: 90 },
    { name: 'Vibrant', value: 85 },
    { name: 'Intense', value: 80 },
    { name: 'Stimulating', value: 75 },
    { name: 'Bright', value: 70 },
  ],
  calming: [
    { name: 'Gentle', value: 90 },
    { name: 'Soothing', value: 85 },
    { name: 'Subtle', value: 80 },
    { name: 'Smooth', value: 75 },
    { name: 'Balanced', value: 70 },
  ],
};

// Color configurations for different moods
const moodColors: Record<MoodCategory, string> = {
  cozy: '#9b87f5',
  adventurous: '#F97316',
  refreshing: '#0EA5E9',
  romantic: '#D946EF',
  energizing: '#FDE047',
  calming: '#67E8F9',
};

const MoodSensoryChart = ({ moodCategory }: MoodSensoryChartProps) => {
  const data = moodSensoryData[moodCategory];
  const areaColor = moodColors[moodCategory];
  
  const chartConfig = {
    area: {
      color: areaColor
    }
  };

  return (
    <div className="w-full h-[300px] mt-4">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              name="Intensity"
              stroke={areaColor}
              fill={`${areaColor}80`}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default MoodSensoryChart;
