"use client";

import React from "react";
import { Transaction } from "@/types/transaction";
import { formatRWF, formatRelativeDate } from "@/lib/formatters";
import { Badge } from "@/components/common/Badge";
import { Bus, ArrowDownLeft, RotateCcw, AlertTriangle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onClick,
}) => {
  const isTopUp = transaction.type === "top_up";
  const isBusFare = transaction.type === "bus_fare";
  const isFailed = transaction.status === "failed";

  const getIcon = () => {
    if (isFailed) {
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
    if (isTopUp) {
      return <ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    }
    if (isBusFare) {
      return <Bus className="w-5 h-5 text-navy-900 dark:text-cyan-400" />;
    }
    return <RotateCcw className="w-5 h-5 text-blue-500" />;
  };

  const getIconBg = () => {
    if (isFailed) return "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900";
    if (isTopUp) return "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/40";
    if (isBusFare) return "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
    return "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900";
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/90 shadow-xs hover:shadow-card hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer select-none"
      )}
    >
      {/* Left: Icon & Description */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={cn(
            "w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105",
            getIconBg()
          )}
        >
          {getIcon()}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {transaction.description}
            </h4>
            {transaction.status === "failed" && (
              <Badge variant="error" size="sm">
                Failed
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {transaction.route ? (
              <span className="truncate">{transaction.route}</span>
            ) : (
              <span>{transaction.paymentMethod === "mtn_momo" ? "MTN MoMo" : "Airtel Money"}</span>
            )}
            <span>•</span>
            <span className="shrink-0">{formatRelativeDate(transaction.timestamp)}</span>
          </div>
        </div>
      </div>

      {/* Right: Amount and Arrow */}
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <div className="text-right">
          <div
            className={cn(
              "text-sm sm:text-base font-bold tracking-tight",
              isTopUp
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-900 dark:text-slate-100"
            )}
          >
            {isTopUp ? `+${formatRWF(transaction.amount)}` : formatRWF(transaction.amount)}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {transaction.maskedCardNumber}
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};
