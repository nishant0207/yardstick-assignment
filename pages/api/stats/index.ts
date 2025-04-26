import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/mongodb';
import Transaction from '../../../lib/models/Transaction';
import Budget from '../../../lib/models/Budget';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7); // Format: YYYY-MM

    // 1. Get all transactions for the current month
    const monthStart = new Date(`${currentMonth}-01`);
    const nextMonthStart = new Date(monthStart);
    nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);

    const transactions = await Transaction.find({
      date: { $gte: monthStart, $lt: nextMonthStart }
    });

    // 2. Total expenses for the month
    const totalExpenses = transactions.reduce((acc, tx) => acc + tx.amount, 0);

    // 3. Category breakdown
    const categoryBreakdown: { [key: string]: number } = {};
    transactions.forEach(tx => {
      if (!categoryBreakdown[tx.category]) {
        categoryBreakdown[tx.category] = 0;
      }
      categoryBreakdown[tx.category] += tx.amount;
    });

    // Monthly budgeted amounts
 const monthlyBudgeted: { _id: string; totalBudgeted: number }[] = await Budget.aggregate([
   {
     $group: {
       _id: { $substr: ["$month", 0, 7] }, // "YYYY-MM"
       totalBudgeted: { $sum: "$amount" },
     },
   },
   { $sort: { _id: 1 } },
 ]);

    // 4. Fetch Budgets for this month
    const budgets = await Budget.find({ month: currentMonth });

    // 5. Budget vs Actual comparison
    const budgetComparison = budgets.map(budget => {
      const spent = categoryBreakdown[budget.category] || 0;
      return {
        category: budget.category,
        budgeted: budget.amount,
        spent,
        remaining: budget.amount - spent
      };
    });

    // 6. Monthly Expenses Bar Chart Data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // current month - 5 months
    const monthlyExpenses = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Final response
    res.status(200).json({
      totalExpenses,
      categoryBreakdown,
      budgetComparison,
      monthlyExpenses,
      monthlyBudgeted,
    });

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error });
  }
}