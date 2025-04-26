"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { formatIndianCurrency } from "@/lib/utils";

interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
}

export default function BudgetList({ 
  refreshSignal,
  onEdit
}: { 
  refreshSignal: number;
  onEdit?: (budget: Budget) => void;
}) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State for the delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/budgets");
      setBudgets(res.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [refreshSignal]);

  const handleDeleteClick = (id: string) => {
    setBudgetToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!budgetToDelete) return;
    
    try {
      await axios.delete(`/api/budgets/${budgetToDelete}`);
      toast.success("Budget deleted successfully");
      fetchBudgets();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete budget");
    } finally {
      setDeleteModalOpen(false);
      setBudgetToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setBudgetToDelete(null);
  };

  if (loading) return (
    <div className="card flex items-center justify-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
    </div>
  );
  
  if (error) return (
    <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
      <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
    </div>
  );
  
  if (budgets.length === 0) return (
    <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
      <p className="text-blue-600 dark:text-blue-400 text-center">No budgets set yet!</p>
    </div>
  );

  // Group budgets by month
  const groupedBudgets = budgets.reduce((groups, budget) => {
    const month = budget.month;
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(budget);
    return groups;
  }, {} as Record<string, Budget[]>);

  // Sort months newest first
  const sortedMonths = Object.keys(groupedBudgets).sort().reverse();

  // Get budget details for the modal message
  const budgetToDeleteDetails = budgetToDelete
    ? budgets.find(b => b._id === budgetToDelete)
    : null;

  const modalMessage = budgetToDeleteDetails
    ? `Are you sure you want to delete the budget for "${budgetToDeleteDetails.category}" in ${formatMonthYear(budgetToDeleteDetails.month)}? This action cannot be undone.`
    : "Are you sure you want to delete this budget? This action cannot be undone.";

  return (
    <div className="space-y-8">
      {sortedMonths.map(month => {
        const monthItems = groupedBudgets[month];
        const totalBudget = monthItems.reduce((sum, budget) => sum + budget.amount, 0);
        
        return (
          <div key={month} className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold dark:text-white">
                {formatMonthYear(month)}
              </h3>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatIndianCurrency(totalBudget)}
              </span>
            </div>
            
            <div className="card !p-0 divide-y divide-gray-100 dark:divide-gray-700">
              {monthItems.map((budget) => (
                <div 
                  key={budget._id} 
                  className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(budget.category)}`}></div>
                    <span className="font-medium dark:text-white">{budget.category}</span>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <span className="font-semibold dark:text-gray-300">{formatIndianCurrency(budget.amount)}</span>
                    
                    <div className="flex space-x-1">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(budget)}
                          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteClick(budget._id)}
                        className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Budget"
        message={modalMessage}
      />
    </div>
  );
}

function formatMonthYear(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getCategoryColor(category: string): string {
  switch (category?.toLowerCase()) {
    case 'food': return 'bg-orange-500';
    case 'bills': return 'bg-red-500';
    case 'shopping': return 'bg-purple-500';
    case 'travel': return 'bg-blue-500';
    case 'utilities': return 'bg-yellow-500';
    case 'healthcare': return 'bg-green-500';
    case 'entertainment': return 'bg-pink-500';
    default: return 'bg-gray-500';
  }
}