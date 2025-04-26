import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/mongodb';
import Transaction from '../../../lib/models/Transaction';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await connectDB();

  switch (req.method) {
    case 'PUT':
      try {
        const { amount, date, description, category } = req.body;
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          id,
          { amount, date, description, category },
          { new: true }
        );
        if (!updatedTransaction) return res.status(404).json({ message: 'Transaction not found' });
        res.status(200).json(updatedTransaction);
      } catch (error) {
        res.status(500).json({ message: 'Failed to update transaction', error });
      }
      break;

    case 'DELETE':
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(id);
        if (!deletedTransaction) return res.status(404).json({ message: 'Transaction not found' });
        res.status(200).json({ message: 'Transaction deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Failed to delete transaction', error });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}