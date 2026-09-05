"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { TransportCard } from "@/components/cards/TransportCard";
import { CardDetailsModal } from "@/components/cards/CardDetailsModal";
import { TransactionItem } from "@/components/transactions/TransactionItem";
import { ReceiptModal } from "@/components/transactions/ReceiptModal";
import { Transaction } from "@/types/transaction";
import { KIGALI_POPULAR_ROUTES } from "@/data/mock-data";
import { formatRWF } from "@/lib/formatters";
import {
  PlusCircle,
  History,
  CreditCard,
  HelpCircle,
  ArrowRight,
  Bus,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const {
    activeCard,
    transactions,
    toggleFreezeCard,
    setActiveCard,
    simulateBusRideDeduction,
  } = useApp();

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Top 4 recent transactions
  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-7 max-w-2xl mx-auto">
      {/* 1. DIGITAL TAP & GO CARD */}
      <section aria-label="Tap & Go Pass">
        <TransportCard
          card={activeCard}
          onViewDetails={() => setIsCardModalOpen(true)}
          showActions={true}
        />
      </section>

      {/* 2. QUICK ACTIONS (Large touch-friendly buttons) */}
      <section aria-label="Quick Actions">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">
          Quick Actions
        </h2>
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          <Link
            href="/top-up"
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-card transition-all group select-none text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              Top Up
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
              MoMo / Airtel
            </span>
          </Link>

          <Link
            href="/transactions"
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-card transition-all group select-none text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <History className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              Activity
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
              Fares & Receipts
            </span>
          </Link>

          <Link
            href="/cards"
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-card transition-all group select-none text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              My Cards
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
              Manage Passes
            </span>
          </Link>

          <a
            href="tel:3012"
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-card transition-all group select-none text-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              Help
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
              Toll-Free 3012
            </span>
          </a>
        </div>
      </section>

      {/* 3. COMMUTER QUICK FARE EXPLORER (Kigali Bus Routes) */}
      <section className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bus className="w-4 h-4 text-navy-900 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Kigali Route Fare Reference
            </h3>
          </div>
          <span className="text-[11px] font-medium text-slate-400">RURA Official Fares</span>
        </div>

        <div className="space-y-2">
          {KIGALI_POPULAR_ROUTES.slice(0, 3).map((route, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                  {route.from} ➔ {route.to}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">({route.duration})</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {formatRWF(route.fare)}
                </span>
                <button
                  type="button"
                  onClick={() => simulateBusRideDeduction(route.fare, `${route.from} → ${route.to}`)}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 shadow-2xs"
                  title="Simulate boarding this bus line"
                >
                  Tap Board
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. RECENT ACTIVITY (Live Transactions) */}
      <section aria-label="Recent Transactions">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Recent Activity
          </h2>
          <Link
            href="/transactions"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {recentTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onClick={() => setSelectedTx(tx)}
            />
          ))}
        </div>
      </section>

      {/* Modals */}
      <CardDetailsModal
        card={activeCard}
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onToggleFreeze={toggleFreezeCard}
        onSetPrimary={setActiveCard}
      />

      <ReceiptModal
        transaction={selectedTx}
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
}
