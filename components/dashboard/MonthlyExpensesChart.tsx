"use client";

import { useState } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  ResponsiveContainer 
} from "recharts";
import { useTheme } from "@/contexts/ThemeContext";
import { formatIndianCurrency } from "@/lib/utils";

interface MonthlyExpensesData {
  _id: string; 
  total: number;
}

interface MonthlyExpensesChartProps {
  data: MonthlyExpensesData[];
  title?: string;
}

type ChartType = 'bar' | 'line';

export default function MonthlyExpensesChart({ 
  data,
  title = "Monthly Expenses"
}: MonthlyExpensesChartProps) {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const textColor = isDarkMode ? '#d1d5db' : '#6b7280';
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
  const barColor = isDarkMode ? '#60a5fa' : '#3B82F6';
  const lineColor = isDarkMode ? '#4ade80' : '#10B981';
  
  // Format data for better display
  const chartData = data.map(item => ({
    ...item,
    _id: formatMonthLabel(item._id)
  }));

  function formatMonthLabel(monthStr: string): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [year, month] = monthStr.split('-');
    return `${months[parseInt(month) - 1]} ${year}`;
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        {title && <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>}
        
        <div className="flex rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 p-1">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              chartType === 'bar'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
            }`}
            aria-label="Show bar chart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              chartType === 'line'
                ? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
            }`}
            aria-label="Show line chart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'bar' ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
              dataKey="_id" 
              stroke={textColor}
              tick={{ fill: textColor }} 
              axisLine={{ stroke: gridColor }}
            />
            <YAxis 
              stroke={textColor} 
              tick={{ fill: textColor }}
              axisLine={{ stroke: gridColor }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                color: isDarkMode ? '#f3f4f6' : '#111827',
                borderRadius: '6px' 
              }}
              formatter={(value: number) => [formatIndianCurrency(value), 'Total']}
            />
            <Bar dataKey="total" fill={barColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="_id" 
              stroke={textColor}
              tick={{ fill: textColor }} 
              axisLine={{ stroke: gridColor }}
            />
            <YAxis 
              stroke={textColor} 
              tick={{ fill: textColor }}
              axisLine={{ stroke: gridColor }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                color: isDarkMode ? '#f3f4f6' : '#111827',
                borderRadius: '6px' 
              }}
              formatter={(value: number) => [formatIndianCurrency(value), 'Total']}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke={lineColor} 
              strokeWidth={3}
              dot={{ fill: lineColor, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
} 