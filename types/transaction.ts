export type TransactionType = 'bus_fare' | 'top_up' | 'refund';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'reversed';

export interface Transaction {
  id: string;
  userId: string;
  cardId: string;
  maskedCardNumber: string;
  type: TransactionType;
  amount: number; // Positive for top-up, negative for fare
  currency: 'RWF';
  status: TransactionStatus;
  description: string;
  route?: string; // e.g., "Kigali Downtown → Kimironko"
  busPlate?: string; // e.g., "RAD 458 B (KBS)"
  busOperator?: string; // e.g. "Kigali Bus Services (KBS)", "Royal Express", "Jali Transport"
  paymentMethod?: 'mtn_momo' | 'airtel_money' | 'card_balance';
  providerReference?: string;
  timestamp: string; // ISO string
  fee: number;
  balanceAfter: number;
  receiptNumber: string;
}

export type TransactionFilter = 'all' | 'bus_fare' | 'top_up' | 'refund' | 'failed';
