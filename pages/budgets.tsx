// pages/budgets.tsx

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import BudgetForm from "@/components/budgets/BudgetForm";
import BudgetList from "@/components/budgets/BudgetList";
import BudgetComparisonChart from "@/components/dashboard/BudgetComparisonChart";
import BudgetInsights from "@/components/budgets/BudgetInsights";
import axios from "axios";

interface BudgetComparison {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
}

export default function BudgetsPage() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [budgetComparison, setBudgetComparison] = useState<BudgetComparison[]>([]);
  const [chartLoading, setChartLoading] = useState<boolean>(true);
  const [chartError, setChartError] = useState<string>("");

  // Load budgets list and comparison data
  useEffect(() => {
    async function loadComparison() {
      try {
        setChartLoading(true);
        const res = await axios.get("/api/stats");
        setBudgetComparison(res.data.budgetComparison);
      } catch (err) {
        console.error(err);
        setChartError("Failed to load budget comparison data");
      } finally {
        setChartLoading(false);
      }
    }
    loadComparison();
  }, [refreshSignal]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Budgets</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column: Form */}
          <section className="lg:col-span-5">
            <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
              Create Budget
            </h2>
            <BudgetForm onAdd={() => setRefreshSignal((p) => p + 1)} />
          </section>

          {/* Right column: List */}
          <section className="lg:col-span-7">
            <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Your Budgets</h2>
            <BudgetList refreshSignal={refreshSignal} />
          </section>
        </div>

        {/* Budget vs Actual Comparison Chart */}
        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Budget Analysis</h2>
          {chartLoading ? (
            <div className="card flex items-center justify-center h-60">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          ) : chartError ? (
            <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-center">{chartError}</p>
            </div>
          ) : (
            <BudgetComparisonChart data={budgetComparison} title="" />
          )}
        </section>

        {/* Budget Insights */}
        <section>
          <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Spending Insights</h2>
          <BudgetInsights budgetComparison={budgetComparison} title="" />
        </section>
      </div>
    </Layout>
  );
}