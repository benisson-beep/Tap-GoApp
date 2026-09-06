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
      {/* Visual Physical-Digital Card Container with Tap & Go / AC Mobility Signature Colors */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-cardGlow transition-all duration-300 ${
          isFrozen
            ? "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 ring-2 ring-red-500/50"
            : "bg-gradient-to-br from-[#00A3E0] via-[#0E4B99] to-[#0B2050] ring-1 ring-white/20"
        }`}
      >
        {/* Dynamic Tap & Go Speed Wave Background Accents */}
        <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-[#00A3E0]/30 blur-2xl pointer-events-none" />
        
        {/* Subtle geometric speed curve overlay (inspired by AC Mobility logo) */}
        <div className="absolute top-0 right-0 w-72 h-72 border-[40px] border-white/5 rounded-full pointer-events-none transform translate-x-24 -translate-y-12" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 border-[20px] border-cyan-300/10 rounded-full pointer-events-none transform translate-y-20" />

        {/* Card Header */}
        <div className="relative z-10 flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* Tap & Go circular emblem */}
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-[#0B2050] shadow-md">
              <span className="font-black text-xs tracking-tighter text-[#00A3E0]">
                Tap<span className="text-[#0B2050]">&amp;</span>Go
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black uppercase tracking-wider text-white">
                  Tap &amp; Go
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-white font-bold">
                  RW
                </span>
              </div>
              <span className="block text-[10px] text-cyan-100 font-medium">
                Public Transport Pass
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Pill */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                isFrozen
                  ? "bg-red-500/20 text-red-200 border-red-500/30"
                  : "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
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
            <div className="p-1.5 rounded-lg bg-white/10 text-white" title="Contactless NFC Enabled">
              <Wifi className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        {/* EMV Microchip Graphic & AC Mobility Signature Speed Lines */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-400 border border-amber-500/40 p-1 flex flex-col justify-between shadow-xs">
              <div className="w-full h-0.5 bg-amber-700/40" />
              <div className="w-2/3 h-0.5 bg-amber-700/40" />
              <div className="w-full h-0.5 bg-amber-700/40" />
            </div>

            {/* AC Mobility Speed Lines indicator */}
            <div className="flex flex-col gap-1 opacity-70">
              <div className="w-4 h-[2px] bg-white rounded-full" />
              <div className="w-6 h-[2px] bg-cyan-200 rounded-full" />
              <div className="w-3 h-[2px] bg-white rounded-full" />
            </div>
          </div>

          {/* Quick Balance visibility toggle */}
          <button
            type="button"
            onClick={() => setHideBalance(!hideBalance)}
            className="text-white/80 hover:text-white p-1 rounded-md transition-colors bg-white/10"
            title={hideBalance ? "Show balance" : "Hide balance"}
          >
            {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Balance Section */}
        <div className="relative z-10 mb-5">
          <span className="text-[11px] font-semibold text-cyan-100 uppercase tracking-wider block">
            Available Balance
          </span>
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1 drop-shadow-sm">
            {hideBalance ? "••••••••" : formatRWF(card.balance)}
          </div>
        </div>

        {/* Card Number & AC Mobility Brand Signature Footer */}
        <div className="relative z-10 flex items-end justify-between pt-3 border-t border-white/20">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-cyan-200 block font-medium">
              {card.nickname || "Card Number"}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-sm tracking-widest text-white font-bold">
                {formattedNumber}
              </span>
              <button
                type="button"
                onClick={() => setShowFullNumber(!showFullNumber)}
                className="text-white/70 hover:text-white text-xs"
                title="Toggle masking"
              >
                {showFullNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* AC Mobility watermark in card footer */}
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <div className="w-3 h-3 rounded-full border border-white flex items-center justify-center text-[7px] font-bold">
                a
              </div>
              <span className="text-[11px] font-extrabold tracking-tight text-white">
                mobility
              </span>
            </div>
            <span className="text-[8px] text-cyan-100 uppercase tracking-wider block">
              Smart transport redefined
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      {showActions && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {onTopUpClick ? (
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-md bg-[#00A3E0] hover:bg-[#008ec2] text-white rounded-2xl font-bold"
              onClick={onTopUpClick}
              leftIcon={<PlusCircle className="w-5 h-5 text-white" />}
            >
              Top Up
            </Button>
          ) : (
            <Link href="/top-up" className="w-full">
              <Button
                variant="primary"
                size="lg"
                className="w-full shadow-md bg-[#00A3E0] hover:bg-[#008ec2] text-white rounded-2xl font-bold"
                leftIcon={<PlusCircle className="w-5 h-5 text-white" />}
              >
                Top Up
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            size="lg"
            className="w-full rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-semibold"
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
