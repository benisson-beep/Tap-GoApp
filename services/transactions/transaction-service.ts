import { Transaction, TransactionFilter } from "@/types/transaction";

export class TransactionService {
  filterTransactions(
    transactions: Transaction[],
    filter: TransactionFilter,
    searchTerm: string = ""
  ): Transaction[] {
    return transactions.filter((tx) => {
      // Type filter
      if (filter === "bus_fare" && tx.type !== "bus_fare") return false;
      if (filter === "top_up" && tx.type !== "top_up") return false;
      if (filter === "refund" && tx.type !== "refund") return false;
      if (filter === "failed" && tx.status !== "failed") return false;

      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const matchesRoute = tx.route?.toLowerCase().includes(query) ?? false;
        const matchesRef = tx.providerReference?.toLowerCase().includes(query) ?? false;
        const matchesReceipt = tx.receiptNumber.toLowerCase().includes(query);
        const matchesBus = tx.busOperator?.toLowerCase().includes(query) ?? false;

        if (!matchesDesc && !matchesRoute && !matchesRef && !matchesReceipt && !matchesBus) {
          return false;
        }
      }

      return true;
    });
  }

  generateReceiptContent(tx: Transaction): string {
    return `
========================================
           TAPGO RWANDA RECEIPT
========================================
Receipt No:     ${tx.receiptNumber}
Date & Time:    ${new Date(tx.timestamp).toLocaleString()}
Type:           ${tx.type === "bus_fare" ? "BUS COMMUTE FARE" : "WALLET TOP UP"}
Card Number:    ${tx.maskedCardNumber}
Amount:         RWF ${Math.abs(tx.amount).toLocaleString()}
Transaction Fee: RWF ${tx.fee}
Balance After:  RWF ${tx.balanceAfter.toLocaleString()}
Status:         ${tx.status.toUpperCase()}
${tx.route ? `Route:          ${tx.route}` : ""}
${tx.busOperator ? `Operator:       ${tx.busOperator}` : ""}
${tx.busPlate ? `Bus Reg:        ${tx.busPlate}` : ""}
${tx.providerReference ? `Provider Ref:   ${tx.providerReference}` : ""}
----------------------------------------
Compliant with Rwanda Utilities
Regulatory Authority (RURA) Guidelines.
Need help? Call Toll Free: 3012
========================================
`.trim();
  }
}

export const transactionService = new TransactionService();
