export type CardStatus = 'active' | 'frozen' | 'blocked' | 'unregistered';

export interface TransportCard {
  id: string;
  userId: string;
  cardNumber: string;          // Full 16-digit number e.g. "9400102030404821"
  maskedCardNumber: string;    // e.g. "**** **** **** 4821" or "**** 4821"
  nickname: string;            // e.g. "Daily Commute", "Work Card"
  balance: number;             // in RWF
  status: CardStatus;
  isPrimary: boolean;
  registeredAt: string;        // ISO string
  lastUsedAt?: string;         // ISO string
  lastUsedRoute?: string;      // e.g. "Nyabugogo → Kimironko"
  expiryDate?: string;         // e.g. "12/28"
  dailySpendLimit?: number;    // e.g. 5000 RWF
}

export interface LinkCardRequest {
  cardNumber: string;
  nickname?: string;
  pin?: string;
}

export interface CardValidationResult {
  valid: boolean;
  code: 'VALID' | 'INVALID_FORMAT' | 'ALREADY_REGISTERED' | 'CARD_NOT_FOUND' | 'NETWORK_ERROR';
  message: string;
  card?: Partial<TransportCard>;
}
