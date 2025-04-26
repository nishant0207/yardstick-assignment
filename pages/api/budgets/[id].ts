import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Budget from "@/lib/models/Budget";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { id } = req.query;

  switch (req.method) {
    case "PUT":
      try {
        const { category, amount, month } = req.body;
        const updatedBudget = await Budget.findByIdAndUpdate(
          id as string,
          { category, amount, month },
          { new: true }
        ).lean();

        if (!updatedBudget) return res.status(404).json({ message: "Budget not found" });
        return res.status(200).json(updatedBudget);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update budget", error });
      }

    case "DELETE":
      try {
        const deletedBudget = await Budget.findByIdAndDelete(id as string).lean();
        if (!deletedBudget) return res.status(404).json({ message: "Budget not found" });

        return res.status(200).json({ message: "Budget deleted successfully" });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete budget", error });
      }

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}