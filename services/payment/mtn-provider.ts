import { IPaymentProvider } from "./payment-provider";
import {
  InitiatePaymentRequest,
  PaymentResult,
  PaymentProviderType,
} from "@/types/payment";
import { formatMaskedCard } from "@/lib/formatters";

/**
 * Production-ready MTN MoMo Rwanda Open API Adapter
 * 
 * Target Specification:
 * - MTN MoMo API: Collections v1.0 (POST /collection/v1_0/requesttopay)
 * - Headers:
 *   - X-Reference-Id: UUID v4 (Transaction Reference)
 *   - X-Target-Environment: "live" | "sandbox"
 *   - Ocp-Apim-Subscription-Key: API Subscription Key
 *   - Authorization: Bearer <OAuth2 Token>
 * 
 * Note: Never store subscription keys or client secrets in frontend code.
 * In a full production deployment, requests to MTN MoMo are signed and dispatched
 * via secure backend server routes (/api/payments/mtn/request-to-pay).
 */
export class MTNMoMoProvider implements IPaymentProvider {
  readonly providerId: PaymentProviderType = "mtn_momo";
  readonly providerName = "MTN Mobile Money (Rwanda)";
  
  private apiKeyConfigured: boolean;

  constructor() {
    // Check if live API credentials are provided via environment variables
    this.apiKeyConfigured = Boolean(
      process.env.NEXT_PUBLIC_MTN_MOMO_ENABLED === "true" &&
      process.env.MTN_MOMO_SUBSCRIPTION_KEY
    );
  }

  async initiatePayment(request: InitiatePaymentRequest): Promise<PaymentResult> {
    if (!this.apiKeyConfigured) {
      throw new Error(
        "MTN MoMo Production API is not configured with live merchant credentials. " +
        "Please switch to Demo Mode to test the top-up flow with mock responses."
      );
    }

    // In production with credentials:
    // Dispatches request to secure server-side proxy route that signs with MTN MoMo API
    const response = await fetch("/api/payments/mtn/initiate", {
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
        provider: "mtn_momo",
        phoneNumber: request.phoneNumber,
        cardId: request.cardId,
        maskedCardNumber: formatMaskedCard(request.cardNumber),
        timestamp: new Date().toISOString(),
        errorCode: errorData.code || "MTN_GATEWAY_ERROR",
        errorMessage: errorData.message || "Failed to communicate with MTN MoMo Gateway.",
      };
    }

    return response.json();
  }

  async checkStatus(transactionId: string): Promise<PaymentResult> {
    if (!this.apiKeyConfigured) {
      throw new Error("MTN MoMo API credentials required.");
    }
    const res = await fetch(`/api/payments/mtn/status?id=${transactionId}`);
    return res.json();
  }

  async cancelPayment(transactionId: string): Promise<boolean> {
    return false; // MTN MoMo USSD prompt push cannot be unilaterally cancelled once pushed
  }
}
