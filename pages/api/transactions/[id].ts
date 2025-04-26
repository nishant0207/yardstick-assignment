import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/mongodb';
import Transaction from '../../../lib/models/Transaction';
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await connectDB();

  switch (req.method) {
    case 'PUT':
      try {
        const { amount, date, description, category } = req.body;
        // 1) update via native driver
        const updateResult = await Transaction.collection.updateOne(
          { _id: new ObjectId(id as string) },
          { $set: { amount, date, description, category } }
        );
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ message: 'Transaction not found' });
        }
        // 2) fetch the updated document
        const updatedTransaction = await Transaction.collection.findOne(
          { _id: new ObjectId(id as string) }
        );
        return res.status(200).json(updatedTransaction);
      } catch (error) {
        return res.status(500).json({ message: 'Failed to update transaction', error });
      }
      break;

    case 'DELETE':
      try {
        const deleteResult = await Transaction.collection.deleteOne(
          { _id: new ObjectId(id as string) }
        );
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ message: 'Transaction not found' });
        }
        return res.status(200).json({ message: 'Transaction deleted successfully' });
      } catch (error) {
        return res.status(500).json({ message: 'Failed to delete transaction', error });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}