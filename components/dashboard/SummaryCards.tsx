"use client";

import { formatIndianCurrency } from "@/lib/utils";

interface Stats {
  totalExpenses: number;
  categoryBreakdown: { [key: string]: number };
  budgetComparison: {
    category: string;
    budgeted: number;
    spent: number;
    remaining: number;
  }[];
  monthlyExpenses: {
    _id: string;
    total: number;
  }[];
}

interface SummaryCardsProps {
  stats: Stats;
  title?: string;
}

export default function SummaryCards({ stats, title = "Summary" }: SummaryCardsProps) {
  const totalBudget = stats.budgetComparison.reduce((acc, b) => acc + b.budgeted, 0);

  return (
    <div className="card">
      {title && <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm">Total Spent</h2>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatIndianCurrency(stats.totalExpenses)}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm">Total Budget</h2>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatIndianCurrency(totalBudget)}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm">Categories</h2>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{Object.keys(stats.categoryBreakdown).length}</p>
        </div>
      </div>
    </div>
  );
}