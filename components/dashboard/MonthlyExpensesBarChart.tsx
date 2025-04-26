"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface MonthlyExpensesBarChartProps {
  data: { _id: string; total: number }[];
  title?: string;
}

export default function MonthlyExpensesBarChart({ 
  data,
  title = "Monthly Expenses"
}: MonthlyExpensesBarChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
      {title && <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="_id" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '4px' }} />
          <Bar dataKey="total" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}