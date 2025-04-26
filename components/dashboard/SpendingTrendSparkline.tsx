import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from "@/contexts/ThemeContext";
import { formatIndianCurrency } from "@/lib/utils";

export interface SpendingTrendData {
  month: string;
  amount: number;
}

interface SpendingTrendSparklineProps {
  data: SpendingTrendData[];
  title?: string;
}

const SpendingTrendSparkline: React.FC<SpendingTrendSparklineProps> = ({ 
  data, 
  title = "Spending Trend" 
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const lineColor = isDarkMode ? '#4ade80' : '#22c55e';

  return (
    <div className="card">
      {title && <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">{title}</h3>}
      <div className="h-20 w-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
              }}
              formatter={(value: number) => [formatIndianCurrency(value), 'Spending']}
              labelFormatter={(label) => label}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: lineColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingTrendSparkline; 