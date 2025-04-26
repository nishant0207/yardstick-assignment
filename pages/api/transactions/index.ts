import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/mongodb';
import Transaction from '../../../lib/models/Transaction';
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const transactions = await Transaction.collection
          .find({})
          .sort({ date: -1 })
          .toArray();
        res.status(200).json(transactions);
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch transactions', error });
      }
      break;

    case 'POST':
      try {
        const { amount, date, description, category } = req.body;
        if (!amount || !date || !description) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
        const insertResult = await Transaction.collection.insertOne({
          amount,
          date,
          description,
          category
        });
        const transaction = await Transaction.collection.findOne({
          _id: insertResult.insertedId
        });
        res.status(201).json(transaction);
      } catch (error) {
        res.status(500).json({ message: 'Failed to create transaction', error });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}