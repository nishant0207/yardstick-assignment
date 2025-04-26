"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EditTransactionModal from "./EditTransactionModal";
import { formatIndianCurrency } from "@/lib/utils";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

export default function TransactionList({
  refreshSignal,
}: {
  refreshSignal: number;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State for the delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
  // State for the edit transaction modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/transactions");
      setTransactions(res.data);
    } catch {
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshSignal]);

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (tx: Transaction) => {
    setTransactionToEdit(tx);
    setEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;
    
    try {
      await axios.delete(`/api/transactions/${transactionToDelete}`);
      toast.success("Transaction deleted successfully");
      fetchTransactions();
    } catch {
      toast.error("Failed to delete transaction");
    } finally {
      setDeleteModalOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setTransactionToDelete(null);
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

  if (transactions.length === 0) return (
    <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
      <p className="text-blue-600 dark:text-blue-400 text-center">No transactions yet. Add one!</p>
    </div>
  );

  // Group transactions by date
  const groupedTransactions: { [date: string]: Transaction[] } = {};
  transactions.forEach(tx => {
    const dateKey = format(new Date(tx.date), "yyyy-MM-dd");
    if (!groupedTransactions[dateKey]) {
      groupedTransactions[dateKey] = [];
    }
    groupedTransactions[dateKey].push(tx);
  });

  // Sort dates newest first
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Get transaction details for the modal message
  const transactionToDeleteDetails = transactionToDelete 
    ? transactions.find(t => t._id === transactionToDelete) 
    : null;

  const modalMessage = transactionToDeleteDetails 
    ? `Are you sure you want to delete the transaction "${transactionToDeleteDetails.description}" for ${formatIndianCurrency(transactionToDeleteDetails.amount)}? This action cannot be undone.`
    : "Are you sure you want to delete this transaction? This action cannot be undone.";

  return (
    <div className="space-y-6">
      {sortedDates.map(dateKey => (
        <div key={dateKey} className="space-y-2">
          <h3 className="font-medium text-gray-500 dark:text-gray-400 text-sm">
            {format(new Date(dateKey), "EEEE, MMMM d, yyyy")}
          </h3>
          
          <div className="space-y-2">
            {groupedTransactions[dateKey].map((tx) => (
              <div
                key={tx._id}
                className="card !p-4 flex justify-between items-center transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex items-start space-x-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-white
                    ${getCategoryColor(tx.category)}
                  `}>
                    {getCategoryIcon(tx.category)}
                  </div>
                  
                  <div>
                    <p className="font-semibold text-lg dark:text-white">{tx.description}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {tx.category || "Uncategorized"}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <p className={`font-bold text-lg ${tx.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {formatIndianCurrency(tx.amount)}
                  </p>
                  
                  <div className="flex space-x-1 mt-1">
                    <button
                      onClick={() => handleEditClick(tx)}
                      className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleDeleteClick(tx._id)}
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
      ))}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message={modalMessage}
      />
      
      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdate={fetchTransactions}
        transaction={transactionToEdit}
      />
    </div>
  );
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

function getCategoryIcon(category: string): React.ReactNode {
  switch (category?.toLowerCase()) {
    case 'food': return <span>🍔</span>;
    case 'bills': return <span>📄</span>;
    case 'shopping': return <span>🛍️</span>;
    case 'travel': return <span>✈️</span>;
    case 'utilities': return <span>💡</span>;
    case 'healthcare': return <span>💊</span>;
    case 'entertainment': return <span>🎬</span>;
    default: return <span>💰</span>;
  }
}