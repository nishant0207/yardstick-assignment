import mongoose, { Schema, models, model } from 'mongoose';

const BudgetSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  month: {
    type: String, // Format: YYYY-MM (example: "2025-04")
    required: true,
  },
}, { timestamps: true });

export default models.Budget || model('Budget', BudgetSchema);