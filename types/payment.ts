export type PaymentProviderType = 'mtn_momo' | 'airtel_money' | 'mock';

export type PaymentStatus = 'idle' | 'initiating' | 'pending_approval' | 'processing' | 'successful' | 'failed' | 'cancelled';

export interface PaymentMethod {
  id: PaymentProviderType;
  name: string;
  tagline: string;
  shortDescription: string;
  iconName: 'mtn' | 'airtel';
  badgeColor: string;
  accentColor: string;
  supportedPrefixes: string[]; // Rwanda mobile prefixes e.g. ["078", "079"] for MTN, ["072", "073"] for Airtel
  transactionFee: number;      // in RWF
  minimumAmount: number;
  maximumAmount: number;
  isAvailable: boolean;
}

export interface InitiatePaymentRequest {
  cardId: string;
  cardNumber: string;
  amount: number;
  provider: PaymentProviderType;
  phoneNumber: string;
  metadata?: {
    commuterName?: string;
    note?: string;
    isDemo?: boolean;
    simulateFailure?: boolean;
  };
}

export interface PaymentResult {
  success: boolean;
  status: PaymentStatus;
  transactionId: string;
  providerReference: string;
  amount: number;
  fee: number;
  total: number;
  currency: 'RWF';
  provider: PaymentProviderType;
  phoneNumber: string;
  cardId: string;
  maskedCardNumber: string;
  newBalance?: number;
  timestamp: string;
  errorMessage?: string;
  errorCode?: string;
}

export interface PaymentProviderInterface {
  readonly providerId: PaymentProviderType;
  readonly providerName: string;
  initiatePayment(request: InitiatePaymentRequest): Promise<PaymentResult>;
  checkStatus(transactionId: string): Promise<PaymentResult>;
  cancelPayment(transactionId: string): Promise<boolean>;
}
