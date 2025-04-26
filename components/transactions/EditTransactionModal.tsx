"use client";

import { useRef, useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "./TransactionForm";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  transaction: Transaction | null;
}

export default function EditTransactionModal({
  isOpen,
  onClose,
  onUpdate,
  transaction
}: EditTransactionModalProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [loading, setLoading] = useState<boolean>(false);

  // Reset form when modal opens with transaction data
  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount);
      setDate(transaction.date.slice(0, 10)); // yyyy-mm-dd
      setDescription(transaction.description);
      setCategory(
        CATEGORIES.includes(transaction.category)
          ? transaction.category
          : "Other"
      );
    }
  }, [transaction]);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Close on Escape key press
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction || !amount || !date || !description) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`/api/transactions/${transaction._id}`, {
        amount,
        date,
        description,
        category,
      });
      toast.success("Transaction updated successfully");
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 mx-4 transform transition-all ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Transaction</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">Amount *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded pl-8 px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
                placeholder="49.99"
                required
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Description *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
              placeholder="Grocery shopping"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                isDarkMode
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              disabled={loading}
            >
              Cancel
            </button>
            <Button 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Transaction"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 