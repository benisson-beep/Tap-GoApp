"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { TransactionList } from "@/components/transactions/TransactionList";
import { ReceiptModal } from "@/components/transactions/ReceiptModal";
import { Transaction } from "@/types/transaction";
import { formatRWF } from "@/lib/formatters";
import { Button } from "@/components/common/Button";
import { Bus, ArrowDownLeft, TrendingDown, TrendingUp, Calendar, History, LogIn } from "lucide-react";
import Link from "next/link";

export default function TransactionsPage() {
  const { transactions, activeCard, isAuthenticated, login } = useApp();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // If logged out, show sign-in gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
          <History className="w-8 h-8 text-[#00A3E0]" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Sign In to View Activity
          </h2>
          <p className="text-xs text-slate-500">
            Log in to view your complete commute ride history, mobile money wallet recharges, and download official receipts.
          </p>
        </div>
        <div className="space-y-2.5 pt-2">
          <Link href="/auth/login" className="block">
            <Button variant="primary" size="lg" className="w-full bg-[#00A3E0] hover:bg-[#008ec2] text-white font-bold" leftIcon={<LogIn className="w-4 h-4" />}>
              Sign In to TapGo
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => login()}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
          >
            Quick Fill Demo Commuter (Jean Bosco)
          </button>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-[#0B2050] dark:text-white">
          Transaction Activity
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          History of all bus rides and mobile money wallet recharges
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <TrendingDown className="w-4 h-4 text-[#00A3E0]" />
            <span>Total Bus Fares</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-[#0B2050] dark:text-white">
            {formatRWF(totalBusFares)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Across all Kigali routes
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Total Top-Ups</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
            {formatRWF(totalTopUps)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            MTN MoMo &amp; Airtel Money
          </span>
        </div>
      </div>

      {/* Filterable Transaction List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
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
