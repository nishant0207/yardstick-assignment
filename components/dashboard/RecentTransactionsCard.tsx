// components/dashboard/RecentTransactionsCard.tsx

"use client";

import { format } from "date-fns";
import Link from "next/link";
import { formatIndianCurrency } from "@/lib/utils";

interface Tx {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface RecentTransactionsCardProps {
  transactions: Tx[];
  title?: string;
  maxHeight?: string;
  showViewAll?: boolean;
}

export default function RecentTransactionsCard({
  transactions,
  title = "Recent Transactions",
  maxHeight = "300px",
  showViewAll = true
}: RecentTransactionsCardProps) {
  return (
    <div className="card h-full flex flex-col">
      {title && <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>}

      {transactions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No recent transactions.</p>
      ) : (
        <>
          <div className="custom-scrollbar overflow-y-auto flex-grow" style={{ maxHeight }}>
            <ul className="space-y-3 pr-2">
              {transactions.map((tx) => (
                <li
                  key={tx._id}
                  className="flex justify-between items-center border-b dark:border-gray-700 pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{tx.description}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {format(new Date(tx.date), "dd MMM yyyy")}
                    </p>
                  </div>
                  <p className={`font-semibold ${tx.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatIndianCurrency(tx.amount)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          
          {showViewAll && (
            <div className="mt-4 pt-2 border-t dark:border-gray-700">
              <Link 
                href="/transactions" 
                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline flex items-center justify-center"
              >
                View all transactions
                <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}