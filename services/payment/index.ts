import { IPaymentProvider } from "./payment-provider";
import { MockPaymentProvider } from "./mock-provider";
import { MTNMoMoProvider } from "./mtn-provider";
import { AirtelMoneyProvider } from "./airtel-provider";
import { PaymentProviderType, InitiatePaymentRequest, PaymentResult } from "@/types/payment";

export class PaymentService {
  private mockMtnProvider: MockPaymentProvider;
  private mockAirtelProvider: MockPaymentProvider;
  private liveMtnProvider: MTNMoMoProvider;
  private liveAirtelProvider: AirtelMoneyProvider;

  constructor() {
    this.mockMtnProvider = new MockPaymentProvider("mtn_momo", "MTN MoMo (Demo)");
    this.mockAirtelProvider = new MockPaymentProvider("airtel_money", "Airtel Money (Demo)");
    this.liveMtnProvider = new MTNMoMoProvider();
    this.liveAirtelProvider = new AirtelMoneyProvider();
  }

  getProvider(type: PaymentProviderType, isDemoMode: boolean): IPaymentProvider {
    if (isDemoMode || type === "mock") {
      return type === "airtel_money" ? this.mockAirtelProvider : this.mockMtnProvider;
    }

    switch (type) {
      case "mtn_momo":
        return this.liveMtnProvider;
      case "airtel_money":
        return this.liveAirtelProvider;
      default:
        return this.mockMtnProvider;
    }
  }

  async processTopUp(request: InitiatePaymentRequest, isDemoMode = true): Promise<PaymentResult> {
    const provider = this.getProvider(request.provider, isDemoMode);
    return provider.initiatePayment(request);
  }
}

export const paymentService = new PaymentService();
