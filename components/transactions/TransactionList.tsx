"use client";

import React, { useState, useMemo } from "react";
import { Transaction, TransactionFilter } from "@/types/transaction";
import { TransactionItem } from "./TransactionItem";
import { EmptyState } from "@/components/common/EmptyState";
import { transactionService } from "@/services/transactions/transaction-service";
import { Search, History, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  showFilters?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onSelectTransaction,
  showFilters = true,
}) => {
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filterTabs: { id: TransactionFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "bus_fare", label: "Bus Fare" },
    { id: "top_up", label: "Top Up" },
    { id: "refund", label: "Refund" },
    { id: "failed", label: "Failed" },
  ];

  const filteredTransactions = useMemo(() => {
    return transactionService.filterTransactions(transactions, filter, searchQuery);
  }, [transactions, filter, searchQuery]);

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search route, operator, or receipt no..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-brand-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {filterTabs.map((tab) => {
              const isSelected = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150",
                    isSelected
                      ? "bg-navy-900 dark:bg-brand-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={History}
          title="No transactions found"
          description={
            searchQuery || filter !== "all"
              ? "Try adjusting your filters or search keyword."
              : "No activity recorded for your Tap & Go card yet."
          }
        />
      ) : (
        <div className="space-y-2.5">
          {filteredTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onClick={() => onSelectTransaction(tx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
