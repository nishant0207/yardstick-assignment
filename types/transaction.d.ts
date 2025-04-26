export interface Transaction {
    _id?: string;
    amount: number;
    date: string; // ISO String
    description: string;
    category?: string;
    createdAt?: string;
    updatedAt?: string;
  }