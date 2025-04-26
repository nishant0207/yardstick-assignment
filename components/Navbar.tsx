"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
        <Link href="/" className="flex items-center space-x-2">
          <svg 
            className="w-8 h-8 text-blue-600 dark:text-blue-400" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 4L4 8L12 12L20 8L12 4Z" 
              fill="currentColor" 
            />
            <path 
              d="M4 12L12 16L20 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <path 
              d="M4 16L12 20L20 16" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeOpacity="0.5"
            />
          </svg>
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Finance Visualizer</h1>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link 
            href="/dashboard" 
            className={`relative px-2 py-1 font-medium transition-colors duration-200
              ${isActive('/dashboard') 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }
            `}
          >
            {isActive('/dashboard') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
            )}
            Dashboard
          </Link>
          
          <Link 
            href="/transactions" 
            className={`relative px-2 py-1 font-medium transition-colors duration-200
              ${isActive('/transactions') 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }
            `}
          >
            {isActive('/transactions') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
            )}
            Transactions
          </Link>
          
          <Link 
            href="/budgets" 
            className={`relative px-2 py-1 font-medium transition-colors duration-200
              ${isActive('/budgets') 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }
            `}
          >
            {isActive('/budgets') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
            )}
            Budgets
          </Link>
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}