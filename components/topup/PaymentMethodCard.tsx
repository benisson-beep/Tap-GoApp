"use client";

import React from "react";
import { PaymentMethod, PaymentProviderType } from "@/types/payment";
import { Check, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: (providerId: PaymentProviderType) => void;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  isSelected,
  onSelect,
}) => {
  const isMtn = method.id === "mtn_momo";

  return (
    <div
      onClick={() => onSelect(method.id)}
      className={cn(
        "relative p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none",
        isSelected
          ? "border-navy-900 dark:border-brand-500 bg-white dark:bg-slate-850 shadow-md shadow-slate-900/5 ring-1 ring-navy-900/10"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Provider Brand Badge Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs",
            isMtn
              ? "bg-[#FFCC00] text-slate-950 ring-2 ring-[#FFCC00]/30"
              : "bg-[#ED1C24] text-white ring-2 ring-[#ED1C24]/30"
          )}
        >
          {isMtn ? "MoMo" : "airtel"}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {method.name}
            </h4>
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center border transition-all",
                isSelected
                  ? "bg-navy-900 dark:bg-brand-600 border-navy-900 text-white"
                  : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
              )}
            >
              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {method.shortDescription}
          </p>

          {/* Feature Badges */}
          <div className="flex items-center gap-3 mt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <Zap className="w-3 h-3" /> Instant Top-Up
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-slate-400" /> Free (RWF 0 fee)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
