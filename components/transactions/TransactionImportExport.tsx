"use client";

import { useState, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useTheme } from '@/contexts/ThemeContext';
import toast from 'react-hot-toast';

interface Transaction {
  _id?: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface TransactionImportExportProps {
  onImport?: () => void;
}

export default function TransactionImportExport({ onImport }: TransactionImportExportProps) {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.xlsx')) {
      toast.error('Please upload an Excel (.xlsx) file');
      return;
    }

    setImporting(true);
    try {
      // Read the Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

      // Map the data to our transaction format
      const transactions: Omit<Transaction, '_id'>[] = jsonData.map((row) => ({
        amount: Number(row.Amount),
        date: typeof row.Date === 'string' ? row.Date : new Date(row.Date).toISOString().split('T')[0],
        description: row.Description,
        category: row.Category,
      }));

      let successCount = 0;
      let errorCount = 0;

      // Import each transaction
      for (const transaction of transactions) {
        try {
          await axios.post('/api/transactions', transaction);
          successCount++;
        } catch (err) {
          console.error('Error importing transaction:', err);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} transactions`);
        // Call onImport callback if provided
        if (onImport) {
          onImport();
        }
      }
      if (errorCount > 0) {
        toast.error(`Failed to import ${errorCount} transactions`);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import transactions');
    } finally {
      setImporting(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // Fetch all transactions
      const response = await axios.get<Transaction[]>('/api/transactions');
      const transactions = response.data;

      // Format data for Excel
      const worksheet = XLSX.utils.json_to_sheet(
        transactions.map((tx) => ({
          Amount: tx.amount,
          Date: tx.date,
          Description: tx.description,
          Category: tx.category,
        }))
      );

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

      // Generate the file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Save the file
      saveAs(data, `transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Transactions exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export transactions');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="file"
        accept=".xlsx"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleImportClick}
        disabled={importing}
        className={`px-4 py-2 rounded-md font-medium flex items-center justify-center ${
          isDarkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {importing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Importing...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
            </svg>
            Import Excel
          </>
        )}
      </button>

      <button
        onClick={handleExport}
        disabled={exporting}
        className={`px-4 py-2 rounded-md font-medium flex items-center justify-center ${
          isDarkMode
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {exporting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export Excel
          </>
        )}
      </button>
    </div>
  );
} 