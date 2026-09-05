import { IPaymentProvider } from "./payment-provider";
import {
  InitiatePaymentRequest,
  PaymentResult,
  PaymentProviderType,
} from "@/types/payment";
import { formatMaskedCard } from "@/lib/formatters";

export class MockPaymentProvider implements IPaymentProvider {
  readonly providerId: PaymentProviderType;
  readonly providerName: string;

  constructor(providerId: PaymentProviderType = "mock", providerName: string = "TapGo Rwanda Mock Provider") {
    this.providerId = providerId;
    this.providerName = providerName;
  }

  async initiatePayment(request: InitiatePaymentRequest): Promise<PaymentResult> {
    // Simulate real network delay for USSD push / operator authorization
    const delay = Math.floor(Math.random() * 800) + 1600;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const now = new Date().toISOString();
    const prefix = request.provider === "mtn_momo" ? "MTN-RW" : "AIRTEL-RW";
    const randomSuffix = Math.floor(10000000 + Math.random() * 90000000);
    const txId = `TXN-${prefix}-${randomSuffix}`;
    const providerRef = `${prefix}-${Date.now().toString().slice(-8)}`;

    // Handle intentional or randomized failure simulation
    if (request.metadata?.simulateFailure) {
      return {
        success: false,
        status: "failed",
        transactionId: txId,
        providerReference: providerRef,
        amount: request.amount,
        fee: 0,
        total: request.amount,
        currency: "RWF",
        provider: request.provider,
        phoneNumber: request.phoneNumber,
        cardId: request.cardId,
        maskedCardNumber: formatMaskedCard(request.cardNumber),
        timestamp: now,
        errorCode: "INSUFFICIENT_FUNDS",
        errorMessage: "Your mobile money account has insufficient funds to complete this top-up. Please recharge your wallet and try again.",
      };
    }

    return {
      success: true,
      status: "successful",
      transactionId: txId,
      providerReference: providerRef,
      amount: request.amount,
      fee: 0,
      total: request.amount,
      currency: "RWF",
      provider: request.provider,
      phoneNumber: request.phoneNumber,
      cardId: request.cardId,
      maskedCardNumber: formatMaskedCard(request.cardNumber),
      timestamp: now,
    };
  }

  async checkStatus(transactionId: string): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      status: "successful",
      transactionId,
      providerReference: `REF-${transactionId.slice(-8)}`,
      amount: 5000,
      fee: 0,
      total: 5000,
      currency: "RWF",
      provider: "mtn_momo",
      phoneNumber: "+250788123456",
      cardId: "card_rw_01",
      maskedCardNumber: "**** 4821",
      timestamp: new Date().toISOString(),
    };
  }

  async cancelPayment(transactionId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return true;
  }
}
