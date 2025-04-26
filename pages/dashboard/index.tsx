// pages/dashboard/index.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import SummaryCards from '@/components/dashboard/SummaryCards';
import MonthlyExpensesChart from '@/components/dashboard/MonthlyExpensesChart';
import CategoryBreakdownChart from '@/components/dashboard/CategoryBreakdownChart';
import RecentTransactionsCard from '@/components/dashboard/RecentTransactionsCard';
import BudgetComparisonChart from '@/components/dashboard/BudgetComparisonChart';
import SpendingInsights from '@/components/dashboard/SpendingInsights';
import SavingsOverview from "@/components/dashboard/SavingsOverview";
import { useTheme } from '@/contexts/ThemeContext';
import Layout from '@/components/Layout';

// Define the data structure to match our component interfaces
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
  monthlyBudgeted: {
    _id: string;
    totalBudgeted: number;
    }[];
  spendingTrend: SpendingTrendData[];
}

interface SpendingTrendData {
  month: string;
  amount: number;
}

interface Tx {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

export default function DashboardPage() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [stats, setStats] = useState<StatsData | null>(null);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError('');
      
      try {
        const [statsRes, txRes] = await Promise.all([
          axios.get('/api/stats'),
          axios.get('/api/transactions'),
        ]);
        
        // Transform data to match our component interfaces if needed
        const statsData = statsRes.data;
        const txData = txRes.data;
        
        setStats(statsData);
        setTransactions(txData.slice(0, 10)); // Show only the 10 most recent transactions
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Dashboard</h1>
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3 mb-4"></div>
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8">
          <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Failed to load dashboard</h3>
                <p className="text-red-700 dark:text-red-300">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Dashboard</h1>
        
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* First row - left column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Overview */}
              <div>
                {/* <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Overview</h2> */}
                <SummaryCards stats={stats} title="Overview" />
              </div>

              <div>
              <SavingsOverview 
              monthlyExpenses={stats.monthlyExpenses} 
              monthlyBudgeted={stats.monthlyBudgeted}
              />
              </div>
              
              {/* Budget vs Actual */}
              <div>
                {/* <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Budget Analysis</h2> */}
                <BudgetComparisonChart data={stats.budgetComparison} title="Budget Analysis" />
              </div>
              
              {/* Charts */}
              <div>
                <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Expense Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MonthlyExpensesChart data={stats.monthlyExpenses} title="Monthly Expenses" />
                  <CategoryBreakdownChart data={stats.categoryBreakdown} title="Category Breakdown" />
                </div>
              </div>
            </div>
            
            {/* First row - right column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Transactions */}
              <div>
                {/* <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Your Transactions</h2> */}
                <RecentTransactionsCard transactions={transactions} title="Your Transactions" maxHeight="300px" />
              </div>
              
              {/* Insights */}
              <div>
                {/* <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Insights</h2> */}
                <SpendingInsights stats={stats} title="Insights" />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
