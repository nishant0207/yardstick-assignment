"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface CategoryBreakdownPieChartProps {
  data: { [key: string]: number };
  title?: string;
}

export default function CategoryBreakdownPieChart({ 
  data, 
  title = "Category Breakdown" 
}: CategoryBreakdownPieChartProps) {
  const pieData = Object.keys(data).map((key) => ({
    name: key,
    value: data[key],
  }));

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
      {title && <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8">
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '4px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}