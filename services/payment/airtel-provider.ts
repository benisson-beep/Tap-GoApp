import { IPaymentProvider } from "./payment-provider";
import {
  InitiatePaymentRequest,
  PaymentResult,
  PaymentProviderType,
} from "@/types/payment";
import { formatMaskedCard } from "@/lib/formatters";

/**
 * Production-ready Airtel Money Rwanda Open API Adapter
 * 
 * Target Specification:
 * - Airtel Money Merchant API: Collections (POST /merchant/v1/payments/)
 * - Headers:
 *   - X-Country: RW
 *   - X-Currency: RWF
 *   - Authorization: Bearer <OAuth2 Token>
 */
export class AirtelMoneyProvider implements IPaymentProvider {
  readonly providerId: PaymentProviderType = "airtel_money";
  readonly providerName = "Airtel Money Rwanda";

  private apiKeyConfigured: boolean;

  constructor() {
    this.apiKeyConfigured = Boolean(
      process.env.NEXT_PUBLIC_AIRTEL_MONEY_ENABLED === "true" &&
      process.env.AIRTEL_MONEY_CLIENT_ID
    );
  }

  async initiatePayment(request: InitiatePaymentRequest): Promise<PaymentResult> {
    if (!this.apiKeyConfigured) {
      throw new Error(
        "Airtel Money Production API is not configured with live merchant credentials. " +
        "Please switch to Demo Mode to test the top-up flow with mock responses."
      );
    }

    const response = await fetch("/api/payments/airtel/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        status: "failed",
        transactionId: `TXN-FAILED-${Date.now()}`,
        providerReference: "NONE",
        amount: request.amount,
        fee: 0,
        total: request.amount,
        currency: "RWF",
        provider: "airtel_money",
        phoneNumber: request.phoneNumber,
        cardId: request.cardId,
        maskedCardNumber: formatMaskedCard(request.cardNumber),
        timestamp: new Date().toISOString(),
        errorCode: errorData.code || "AIRTEL_GATEWAY_ERROR",
        errorMessage: errorData.message || "Failed to communicate with Airtel Money Gateway.",
      };
    }

    return response.json();
  }

  async checkStatus(transactionId: string): Promise<PaymentResult> {
    if (!this.apiKeyConfigured) {
      throw new Error("Airtel Money API credentials required.");
    }
    const res = await fetch(`/api/payments/airtel/status?id=${transactionId}`);
    return res.json();
  }

  async cancelPayment(transactionId: string): Promise<boolean> {
    return false;
  }
}
