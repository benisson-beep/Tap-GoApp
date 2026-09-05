import { TransportCard, CardValidationResult, LinkCardRequest } from "@/types/card";
import { formatMaskedCard } from "@/lib/formatters";

export class CardService {
  /**
   * Validates a Tap & Go card number against system rules:
   * 1. Must be numeric and 16 digits (or 8-16 digits depending on older/newer cards)
   * 2. Checks if card already registered in commuter's account
   * 3. Checks if card exists in central Tap & Go registry
   */
  async validateAndLinkCard(
    request: LinkCardRequest,
    existingCards: TransportCard[],
    options?: { simulateNetworkError?: boolean; simulateNotFound?: boolean }
  ): Promise<CardValidationResult> {
    // Artificial network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (options?.simulateNetworkError) {
      return {
        valid: false,
        code: "NETWORK_ERROR",
        message: "Unable to connect to Tap & Go verification server. Please check your internet connection.",
      };
    }

    const cleanNumber = request.cardNumber.replace(/\s+/g, "");

    // Format validation: 16 digits numeric
    if (!/^\d{16}$/.test(cleanNumber)) {
      return {
        valid: false,
        code: "INVALID_FORMAT",
        message: "Invalid card number format. Tap & Go cards have 16 digits printed on the front.",
      };
    }

    // Already registered check
    const isAlreadyLinked = existingCards.some((c) => c.cardNumber.replace(/\s+/g, "") === cleanNumber);
    if (isAlreadyLinked) {
      return {
        valid: false,
        code: "ALREADY_REGISTERED",
        message: "This Tap & Go card is already registered to your account.",
      };
    }

    // Card not found simulation (e.g., if number ends in 0000 or flag is set)
    if (options?.simulateNotFound || cleanNumber.endsWith("0000")) {
      return {
        valid: false,
        code: "CARD_NOT_FOUND",
        message: "Card not found in the Tap & Go central transport registry. Please verify the card number.",
      };
    }

    // Successfully linked
    const newCard: TransportCard = {
      id: `card_rw_${Date.now()}`,
      userId: "usr_rw_01",
      cardNumber: cleanNumber,
      maskedCardNumber: formatMaskedCard(cleanNumber, true),
      nickname: request.nickname?.trim() || "My Tap & Go Card",
      balance: 1000, // Welcome/initial verified card balance
      status: "active",
      isPrimary: existingCards.length === 0,
      registeredAt: new Date().toISOString(),
      expiryDate: "12/29",
      dailySpendLimit: 5000,
    };

    return {
      valid: true,
      code: "VALID",
      message: "Your Tap & Go card has been linked successfully.",
      card: newCard,
    };
  }
}

export const cardService = new CardService();
