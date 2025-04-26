// components/transactions/TransactionForm.tsx

"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

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

interface Props {
  onAdd: () => void;
  onUpdate: () => void;
  onCancelEdit: () => void;
}

export default function TransactionForm({
  onAdd,
  onUpdate,
  onCancelEdit,
}: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [loading, setLoading] = useState<boolean>(false);

  const resetForm = () => {
    setAmount(0);
    setDate("");
    setDescription("");
    setCategory(CATEGORIES[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !description) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      // ADD new transaction
      await axios.post("/api/transactions", {
        amount,
        date,
        description,
        category,
      });
      toast.success("Transaction added successfully");
      resetForm();
      onAdd();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add transaction");
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

      <div className="flex space-x-2 pt-2">
        <Button 
          type="submit" 
          disabled={loading}
          className="relative overflow-hidden"
        >
          <span className="relative z-10">
            {loading ? "Adding..." : "Add Transaction"}
          </span>
        </Button>
      </div>
    </form>
  );
}