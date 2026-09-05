"use client";

import React, { useState } from "react";
import { PRESET_AMOUNTS } from "@/data/mock-data";
import { formatRWF } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface AmountSelectorProps {
  selectedAmount: number;
  onSelectAmount: (amount: number) => void;
}

export const AmountSelector: React.FC<AmountSelectorProps> = ({
  selectedAmount,
  onSelectAmount,
}) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handlePresetClick = (amount: number) => {
    setIsCustom(false);
    onSelectAmount(amount);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setCustomValue(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      onSelectAmount(num);
    } else {
      onSelectAmount(0);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Select Amount
        </label>
        <span className="text-xs text-slate-400">Min: RWF 500 • Max: RWF 100,000</span>
      </div>

      {/* Preset Amount Grid */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {PRESET_AMOUNTS.map((amt) => {
          const isSelected = !isCustom && selectedAmount === amt;
          return (
            <button
              key={amt}
              type="button"
              onClick={() => handlePresetClick(amt)}
              className={cn(
                "py-3 px-2 rounded-2xl border text-center transition-all duration-150 active:scale-95 font-semibold text-sm",
                isSelected
                  ? "bg-navy-900 dark:bg-brand-600 text-white border-navy-900 dark:border-brand-500 shadow-md shadow-navy-900/15"
                  : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50"
              )}
            >
              {formatRWF(amt)}
            </button>
          );
        })}
      </div>

      {/* Custom Amount Button & Field */}
      <div className="pt-1">
        {!isCustom ? (
          <button
            type="button"
            onClick={() => {
              setIsCustom(true);
              setCustomValue(selectedAmount ? selectedAmount.toString() : "");
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-center"
          >
            + Enter Custom Amount
          </button>
        ) : (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-semibold text-sm">
              RWF
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={customValue}
              onChange={handleCustomChange}
              placeholder="e.g. 7500"
              className="w-full pl-14 pr-20 py-3 rounded-xl border border-brand-500 bg-white dark:bg-slate-900 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-brand-500"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setIsCustom(false);
                onSelectAmount(5000);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 p-1"
            >
              Presets
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
