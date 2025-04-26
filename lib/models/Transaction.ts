import mongoose, { Schema, models, model } from 'mongoose';

const TransactionSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'Uncategorized',
  },
}, { timestamps: true });

export default models.Transaction || model('Transaction', TransactionSchema);