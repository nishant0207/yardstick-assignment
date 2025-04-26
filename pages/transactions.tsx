// pages/transactions.tsx

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import axios from "axios";
import TransactionImportExport from "@/components/transactions/TransactionImportExport";
import MonthlyExpensesChart from "@/components/dashboard/MonthlyExpensesChart";
import CategoryBreakdownChart from "@/components/dashboard/CategoryBreakdownChart";

interface StatsData {
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

export default function TransactionsPage() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const triggerRefresh = () => {
    setRefreshSignal(prevValue => prevValue + 1);
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const { data } = await axios.get('/api/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats data', error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [refreshSignal]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Transactions
          </h1>
          <TransactionImportExport onImport={() => {
            triggerRefresh();
            loadStats();
          }} />
        </div>

        {/* Two-column layout: Form on left, List on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              Add New Transaction
            </h2>
            <TransactionForm
              onAdd={() => {
                triggerRefresh();
                // Also refresh the charts when a transaction is added
                loadStats();
              }}
              onUpdate={() => {
                triggerRefresh();
                // Also refresh the charts when a transaction is updated
                loadStats();
              }}
              onCancelEdit={() => {}}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              Your Transactions
            </h2>
            <TransactionList
              refreshSignal={refreshSignal}
            />
          </section>
        </div>

        {/* Charts */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <MonthlyExpensesChart data={stats.monthlyExpenses} />
            <CategoryBreakdownChart data={stats.categoryBreakdown} />
          </div>
        )}
      </div>
    </Layout>
  );
}