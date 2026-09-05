import {
  InitiatePaymentRequest,
  PaymentResult,
  PaymentProviderType,
} from "@/types/payment";

export interface IPaymentProvider {
  readonly providerId: PaymentProviderType;
  readonly providerName: string;

  /**
   * Initiates a top-up transaction with the mobile money operator.
   * In a real system, this sends a request to the operator to initiate a USSD push
   * to the customer's mobile device.
   */
  initiatePayment(request: InitiatePaymentRequest): Promise<PaymentResult>;

  /**
   * Queries the operator for the current transaction status.
   */
  checkStatus(transactionId: string): Promise<PaymentResult>;

  /**
   * Cancels a pending transaction if supported by operator API.
   */
  cancelPayment(transactionId: string): Promise<boolean>;
}
