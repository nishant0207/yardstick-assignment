// components/budgets/BudgetForm.tsx

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

// Reuse the same category list as transactions
export const CATEGORIES = [
  "Food",
  "Bills",
  "Shopping",
  "Travel",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Other",
];

interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
}

interface Props {
  onAdd: () => void;
  editingBudget?: Budget | null;
  onUpdate?: () => void;
  onCancelEdit?: () => void;
}

export default function BudgetForm({
  onAdd,
  editingBudget = null,
  onUpdate,
  onCancelEdit,
}: Props) {
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [amount, setAmount] = useState<number>(0);
  const [month, setMonth] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // When editing, populate form
  useEffect(() => {
    if (editingBudget) {
      setCategory(
        CATEGORIES.includes(editingBudget.category)
          ? editingBudget.category
          : "Other"
      );
      setAmount(editingBudget.amount);
      setMonth(editingBudget.month);
    } else {
      // reset on cancel or after update
      setCategory(CATEGORIES[0]);
      setAmount(0);
      setMonth("");
    }
  }, [editingBudget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount || !month) {
      toast.error("Please fill all fields!");
      return;
    }
    try {
      setLoading(true);
      if (editingBudget && onUpdate) {
        // EDIT existing budget
        await axios.put(`/api/budgets/${editingBudget._id}`, {
          category,
          amount,
          month,
        });
        toast.success("Budget updated successfully");
        onUpdate();
      } else {
        // ADD new budget
        await axios.post("/api/budgets", { category, amount, month });
        toast.success("Budget added successfully");
        onAdd();
      }
    } catch (err) {
      console.error(err);
      toast.error(editingBudget ? "Failed to update budget" : "Failed to add budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card space-y-6"
    >
      <div>
        <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">Category *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-200"
          required
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">Amount *</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">₹</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 pl-8 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-200"
            placeholder="2500"
            required
            step="0.01"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">Month *</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-200"
          required
        />
      </div>

      <div className="flex space-x-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading
            ? editingBudget
              ? "Updating..."
              : "Adding..."
            : editingBudget
            ? "Update Budget"
            : "Add Budget"}
        </Button>
        {editingBudget && onCancelEdit && (
          <Button
            variant="outline"
            onClick={() => onCancelEdit()}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}