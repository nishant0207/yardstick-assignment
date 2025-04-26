// pages/api/budgets/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Budget from "@/lib/models/Budget";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const budgets = await Budget.find().sort({ month: -1 });
        return res.status(200).json(budgets);
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Failed to fetch budgets", error });
      }

    case "POST":
      try {
        const { category, amount, month } = req.body;
        if (!category || !amount || !month) {
          return res
            .status(400)
            .json({ message: "Missing required fields" });
        }
        const budget = await Budget.create({ category, amount, month });
        return res.status(201).json(budget);
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Failed to create budget", error });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}