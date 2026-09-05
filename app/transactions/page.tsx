"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { TransactionList } from "@/components/transactions/TransactionList";
import { ReceiptModal } from "@/components/transactions/ReceiptModal";
import { Transaction } from "@/types/transaction";
import { formatRWF } from "@/lib/formatters";
import { Bus, ArrowDownLeft, TrendingDown, TrendingUp, Calendar } from "lucide-react";

export default function TransactionsPage() {
  const { transactions, activeCard } = useApp();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Calculate monthly stats
  const totalBusFares = transactions
    .filter((t) => t.type === "bus_fare" && t.status === "completed")
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const totalTopUps = transactions
    .filter((t) => t.type === "top_up" && t.status === "completed")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Transaction Activity
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          History of all bus rides and mobile money wallet recharges
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <TrendingDown className="w-4 h-4 text-blue-500" />
            <span>Total Bus Fares</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {formatRWF(totalBusFares)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Across all Kigali routes
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Total Top-Ups</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatRWF(totalTopUps)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            MTN MoMo & Airtel Money
          </span>
        </div>
      </div>

      {/* Filterable Transaction List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            All Records ({transactions.length})
          </h2>
          <span className="text-xs text-slate-400">Tap item to view official receipt</span>
        </div>

        <TransactionList
          transactions={transactions}
          onSelectTransaction={(tx) => setSelectedTx(tx)}
          showFilters={true}
        />
      </section>

      {/* Receipt Modal */}
      <ReceiptModal
        transaction={selectedTx}
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
}
