// components/dashboard/SpendingInsights.tsx

"use client";

import { formatIndianCurrency } from "@/lib/utils";

interface BudgetComparison {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
}

interface MonthlyExpense {
  _id: string;    // "YYYY-MM"
  total: number;
}

interface Stats {
  totalExpenses: number;
  categoryBreakdown: { [key: string]: number };
  budgetComparison: BudgetComparison[];
  monthlyExpenses: MonthlyExpense[];
}

interface SpendingInsightsProps {
  stats: Stats;
  title?: string;
}

export default function SpendingInsights({ 
  stats,
  title = "Spending Insights" 
}: SpendingInsightsProps) {
  const { monthlyExpenses, budgetComparison } = stats;

  // Compute month-over-month change
  let percentChangeText = "";
  let changeType: 'increase' | 'decrease' | 'neutral' = 'neutral';
  
  if (monthlyExpenses.length >= 2) {
    const n = monthlyExpenses.length;
    const current = monthlyExpenses[n - 1].total;
    const previous = monthlyExpenses[n - 2].total;
    if (previous > 0) {
      const change = ((current - previous) / previous) * 100;
      const sign = change >= 0 ? "increased" : "decreased";
      changeType = change > 0 ? 'increase' : change < 0 ? 'decrease' : 'neutral';
      percentChangeText = `Your spending has ${sign} by ${Math.abs(
        change
      ).toFixed(1)}% compared to last month.`;
    }
  }

  // Insights for each category vs budget
  const categoryInsights = budgetComparison.map((b) => {
    if (b.remaining < 0) {
      return {
        text: `You overspent by ${formatIndianCurrency(Math.abs(b.remaining))} on ${b.category}.`,
        type: 'negative' as const
      };
    } else if (b.remaining > 0) {
      return {
        text: `You are under budget by ${formatIndianCurrency(b.remaining)} on ${b.category}.`,
        type: 'positive' as const
      };
    } else {
      return {
        text: `You exactly met your budget for ${b.category}.`,
        type: 'neutral' as const
      };
    }
  });

  return (
    <div className="card">
      {title && <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>}

      {percentChangeText && (
        <p className={`mb-4 ${
          changeType === 'increase' 
            ? 'text-red-600 dark:text-red-400' 
            : changeType === 'decrease' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-gray-700 dark:text-gray-300'
        }`}>
          {percentChangeText}
        </p>
      )}

      <ul className="space-y-3">
        {categoryInsights.map((insight, idx) => (
          <li 
            key={idx} 
            className={`flex items-start space-x-2 ${
              insight.type === 'negative' 
                ? 'text-red-600 dark:text-red-400' 
                : insight.type === 'positive' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="mt-1">
              {insight.type === 'negative' ? '⚠️' : insight.type === 'positive' ? '✅' : '•'}
            </span>
            <span>{insight.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}