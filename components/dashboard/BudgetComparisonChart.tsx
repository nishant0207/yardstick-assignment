// components/dashboard/BudgetComparisonChart.tsx

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/contexts/ThemeContext";
import { formatIndianCurrency } from "@/lib/utils";

interface BudgetComparison {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
}

interface BudgetComparisonChartProps {
  data: BudgetComparison[];
  title?: string;
}

export default function BudgetComparisonChart({
  data,
  title = "Budget vs. Actual"
}: BudgetComparisonChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Custom tooltip formatter to use Indian currency format
  const customTooltipFormatter = (value: number, name: string) => {
    // Map the internal dataKey names to user-friendly labels
    let label;
    switch(name) {
      case 'budgeted':
        label = 'Budgeted';
        break;
      case 'spent':
        label = 'Spent';
        break;
      default:
        label = name;
    }
    return [formatIndianCurrency(value), label];
  };
  
  return (
    <div className="card">
      {title && <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="category" 
            tick={{ fill: isDark ? '#d1d5db' : '#6b7280' }}
            axisLine={{ stroke: isDark ? '#4b5563' : '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fill: isDark ? '#d1d5db' : '#6b7280' }}
            axisLine={{ stroke: isDark ? '#4b5563' : '#e5e7eb' }}
          />
          <Tooltip 
            formatter={customTooltipFormatter}
            contentStyle={{ 
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
              borderColor: isDark ? '#4b5563' : '#e5e7eb',
              color: isDark ? '#f3f4f6' : '#111827',
              borderRadius: '6px'
            }}
            itemStyle={{ color: isDark ? '#f3f4f6' : '#111827' }}
            labelStyle={{ color: isDark ? '#f3f4f6' : '#111827' }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{ color: isDark ? '#d1d5db' : '#6b7280' }} 
          />
          <Bar dataKey="budgeted" name="Budgeted" fill={isDark ? "#22c55e" : "#10B981"} />
          <Bar dataKey="spent" name="Spent" fill={isDark ? "#60a5fa" : "#3B82F6"} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}