"use client";

import { useState } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { useTheme } from "@/contexts/ThemeContext";
import { formatIndianCurrency } from "@/lib/utils";

interface CategoryBreakdownChartProps {
  data: { [key: string]: number };
  title?: string;
}

type ChartType = 'pie' | 'bar';

// Chart colors
const COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#ef4444', '#14b8a6', '#f59e0b', '#6366f1'];

export default function CategoryBreakdownChart({ 
  data, 
  title = "Category Breakdown" 
}: CategoryBreakdownChartProps) {
  const [chartType, setChartType] = useState<ChartType>('pie');
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Colors based on theme
  const gridColor = isDarkMode ? '#4b5563' : '#e5e7eb';
  const textColor = isDarkMode ? '#d1d5db' : '#6b7280';
  
  // Transform data for charts
  const chartData = Object.entries(data).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length]
  }));

  // Compute total value for legend percentages
  const totalValue = chartData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="card">
      {title && <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>}
      
      <div className="flex justify-end mb-4">
        <div className="inline-flex border border-gray-200 dark:border-gray-700 rounded-md">
          <button
            className={`px-3 py-1 text-sm ${
              chartType === 'pie'
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            } rounded-l-md transition-colors`}
            onClick={() => setChartType('pie')}
          >
            Pie
          </button>
          <button
            className={`px-3 py-1 text-sm ${
              chartType === 'bar'
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            } rounded-r-md transition-colors`}
            onClick={() => setChartType('bar')}
          >
            Bar
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'pie' ? (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              labelLine={false}
              label={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [formatIndianCurrency(value), 'Amount']}
              contentStyle={{ 
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                color: isDarkMode ? '#f3f4f6' : '#111827',
                borderRadius: '6px' 
              }}
            />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{
                marginTop: 20,
                color: textColor,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1rem',
              }}
              formatter={(value: string) => {
                const entry = chartData.find(e => e.name === value);
                const percent = entry ? ((entry.value / totalValue) * 100).toFixed(0) : '0';
                return `${value}: ${percent}%`;
              }}
            />
          </PieChart>
        ) : (
          <BarChart 
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis 
              type="number" 
              stroke={textColor}
              tick={{ fill: textColor }}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis 
              type="category"
              dataKey="name" 
              stroke={textColor}
              tick={{ fill: textColor }}
              axisLine={{ stroke: gridColor }}
              width={90}
            />
            <Tooltip 
              formatter={(value: number) => [formatIndianCurrency(value), 'Amount']}
              contentStyle={{ 
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                color: isDarkMode ? '#f3f4f6' : '#111827',
                borderRadius: '6px' 
              }}
            />
            <Bar 
              dataKey="value" 
              background={{ fill: isDarkMode ? '#1f2937' : '#f3f4f6' }}
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}