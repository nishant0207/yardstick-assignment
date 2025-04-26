import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Budget from "@/lib/models/Budget";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  switch (req.method) {
    case "PUT":
      try {
        const { category, amount, month } = req.body;

        const query = Budget.findByIdAndUpdate(
          id,
          { category, amount, month },
          { new: true }
        );

        const updatedBudget = await query.exec(); // THIS is the clean fix ✅

        if (!updatedBudget) {
          return res.status(404).json({ message: "Budget not found" });
        }

        return res.status(200).json(updatedBudget);
      } catch (error) {
        console.error("Error updating budget:", error);
        return res.status(500).json({ message: "Failed to update budget", error });
      }

    case "DELETE":
      try {
        const query = Budget.findByIdAndDelete(id);

        const deletedBudget = await query.exec();

        if (!deletedBudget) {
          return res.status(404).json({ message: "Budget not found" });
        }

        return res.status(200).json({ message: "Budget deleted successfully" });
      } catch (error) {
        console.error("Error deleting budget:", error);
        return res.status(500).json({ message: "Failed to delete budget", error });
      }

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}