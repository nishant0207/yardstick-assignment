// components/budgets/BudgetInsights.tsx

"use client";

import { formatIndianCurrency } from "@/lib/utils";

interface BudgetComparison {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
}

interface BudgetInsightsProps {
  budgetComparison: BudgetComparison[];
  title?: string;
}

export default function BudgetInsights({
  budgetComparison,
  title = "Budget Insights"
}: BudgetInsightsProps) {
  if (budgetComparison.length === 0) {
    return (
      <div className="card mt-12">
        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400">No budget data available.</p>
      </div>
    );
  }

  return (
    <div className="card space-y-4 mt-12">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>
      <ul className="space-y-3">
        {budgetComparison.map((b) => {
          if (b.remaining < 0) {
            return (
              <li key={b.category} className="flex items-start space-x-2 text-red-600 dark:text-red-400">
                <span className="mt-1">⚠️</span>
                <span>
                  You overspent by {formatIndianCurrency(Math.abs(b.remaining))} on {b.category}.
                </span>
              </li>
            );
          } else if (b.remaining > 0) {
            return (
              <li key={b.category} className="flex items-start space-x-2 text-green-600 dark:text-green-400">
                <span className="mt-1">✅</span>
                <span>
                  You are under budget by {formatIndianCurrency(b.remaining)} on {b.category}.
                </span>
              </li>
            );
          } else {
            return (
              <li key={b.category} className="flex items-start space-x-2 text-gray-700 dark:text-gray-300">
                <span className="mt-1">•</span>
                <span>
                  You exactly met your budget for {b.category}.
                </span>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}