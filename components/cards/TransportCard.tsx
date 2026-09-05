"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wifi, PlusCircle, Eye, EyeOff, ShieldCheck, ArrowUpRight } from "lucide-react";
import { TransportCard as TransportCardType } from "@/types/card";
import { formatRWF } from "@/lib/formatters";
import { Button } from "@/components/common/Button";

interface TransportCardProps {
  card: TransportCardType;
  onViewDetails?: () => void;
  onTopUpClick?: () => void;
  showActions?: boolean;
}

export const TransportCard: React.FC<TransportCardProps> = ({
  card,
  onViewDetails,
  onTopUpClick,
  showActions = true,
}) => {
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);

  const formattedNumber = showFullNumber
    ? card.cardNumber.replace(/(\d{4})/g, "$1 ").trim()
    : card.maskedCardNumber;

  const isFrozen = card.status === "frozen";

  return (
    <div className="w-full">
      {/* Visual Physical-Digital Card Container */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-xl transition-all duration-300 ${
          isFrozen
            ? "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 ring-2 ring-red-500/50"
            : "bg-gradient-to-br from-navy-900 via-[#0E274A] to-[#143B6B] shadow-navy-900/25 ring-1 ring-white/15"
        }`}
      >
        {/* Subtle geometric Rwandan-inspired wave / watermark background */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-blue-600/15 blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 flex items-start justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <span className="font-extrabold text-sm tracking-wider text-cyan-300">TG</span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                Tap & Go
              </span>
              <span className="block text-[10px] text-white/50 font-medium">
                Rwanda Transport Pass
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Pill */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                isFrozen
                  ? "bg-red-500/20 text-red-200 border-red-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isFrozen ? "bg-red-400" : "bg-emerald-400 animate-pulse"
                }`}
              />
              {isFrozen ? "Card Frozen" : "Active"}
            </span>

            {/* Contactless Wave Icon */}
            <div className="p-1.5 rounded-lg bg-white/5 text-white/70" title="Contactless NFC Enabled">
              <Wifi className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        {/* EMV Microchip graphic */}
        <div className="relative z-10 flex items-center justify-between mb-5">
          <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-400 border border-amber-500/40 p-1 flex flex-col justify-between shadow-xs">
            <div className="w-full h-0.5 bg-amber-600/40" />
            <div className="w-2/3 h-0.5 bg-amber-600/40" />
            <div className="w-full h-0.5 bg-amber-600/40" />
          </div>

          {/* Quick Balance visibility toggle */}
          <button
            type="button"
            onClick={() => setHideBalance(!hideBalance)}
            className="text-white/60 hover:text-white p-1 rounded-md transition-colors"
            title={hideBalance ? "Show balance" : "Hide balance"}
          >
            {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Balance Section */}
        <div className="relative z-10 mb-6">
          <span className="text-xs font-medium text-white/60 block uppercase tracking-wider">
            Available Balance
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
            {hideBalance ? "••••••••" : formatRWF(card.balance)}
          </div>
        </div>

        {/* Card Number & Nickname Footer */}
        <div className="relative z-10 flex items-end justify-between pt-3 border-t border-white/10">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">
              {card.nickname || "Card Number"}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-sm tracking-widest text-white/90">
                {formattedNumber}
              </span>
              <button
                type="button"
                onClick={() => setShowFullNumber(!showFullNumber)}
                className="text-white/40 hover:text-white text-xs"
                title="Toggle masking"
              >
                {showFullNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">
              Expires
            </span>
            <span className="font-mono text-xs text-white/80">{card.expiryDate || "12/28"}</span>
          </div>
        </div>
      </div>

      {/* Card Action Buttons (Under the card) */}
      {showActions && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {onTopUpClick ? (
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-md bg-navy-900 hover:bg-navy-800 text-white rounded-2xl"
              onClick={onTopUpClick}
              leftIcon={<PlusCircle className="w-5 h-5 text-cyan-400" />}
            >
              Top Up
            </Button>
          ) : (
            <Link href="/top-up" className="w-full">
              <Button
                variant="primary"
                size="lg"
                className="w-full shadow-md bg-navy-900 hover:bg-navy-800 text-white rounded-2xl"
                leftIcon={<PlusCircle className="w-5 h-5 text-cyan-400" />}
              >
                Top Up
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            size="lg"
            className="w-full rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
            onClick={onViewDetails}
            rightIcon={<ArrowUpRight className="w-4 h-4 text-slate-400" />}
          >
            Card Details
          </Button>
        </div>
      )}
    </div>
  );
};
