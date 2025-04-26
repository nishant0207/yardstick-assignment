// components/Layout.tsx
"use client";

import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--toast-bg, #fff)',
            color: 'var(--toast-color, #333)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#ECFDF5',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FEF2F2',
            },
          },
        }}
      />
    </div>
  );
}