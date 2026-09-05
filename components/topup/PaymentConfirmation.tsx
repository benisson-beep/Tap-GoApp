"use client";

import React, { useState } from "react";
import { TransportCard } from "@/types/card";
import { PaymentProviderType } from "@/types/payment";
import { formatRWF, formatMaskedCard } from "@/lib/formatters";
import { Button } from "@/components/common/Button";
import { Lock, Smartphone, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";

interface PaymentConfirmationProps {
  card: TransportCard;
  amount: number;
  provider: PaymentProviderType;
  defaultPhone: string;
  onConfirm: (phone: string, simulateFailure?: boolean) => void;
  onBack: () => void;
  isLoading: boolean;
}

export const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  card,
  amount,
  provider,
  defaultPhone,
  onConfirm,
  onBack,
  isLoading,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(() => {
    const raw = defaultPhone.replace(/\D/g, "");
    if (raw.startsWith("250")) return raw.slice(3);
    if (raw.startsWith("0")) return raw.slice(1);
    return raw || "788123456";
  });

  const [simulateFailure, setSimulateFailure] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const isMtn = provider === "mtn_momo";
  const providerName = isMtn ? "MTN MoMo" : "Airtel Money";
  const fee = 0; // RWF 0
  const total = amount + fee;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, "").slice(0, 9);
    setPhoneNumber(clean);
    if (phoneError) setPhoneError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneNumber.length !== 9) {
      setPhoneError("Please enter a valid 9-digit Rwanda mobile number.");
      return;
    }

    // Prefix validation for MTN (78, 79) or Airtel (72, 73)
    if (isMtn && !phoneNumber.startsWith("78") && !phoneNumber.startsWith("79")) {
      setPhoneError("MTN MoMo numbers usually start with 078 or 079.");
      // Soft warning, allow proceeding if commuter insists
    }

    if (!isMtn && !phoneNumber.startsWith("72") && !phoneNumber.startsWith("73")) {
      setPhoneError("Airtel Money numbers usually start with 072 or 073.");
    }

    onConfirm(`+250${phoneNumber}`, simulateFailure);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Summary Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Payment Breakdown
        </div>

        <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400">Top Up Amount</span>
          <span className="font-bold text-slate-900 dark:text-white">{formatRWF(amount)}</span>
        </div>

        <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400">Tap & Go Card</span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
            {formatMaskedCard(card.cardNumber)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400">Payment Provider</span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <span
              className={`w-2 h-2 rounded-full ${
                isMtn ? "bg-[#FFCC00]" : "bg-[#ED1C24]"
              }`}
            />
            {providerName}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400">Transaction Fee</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Free (RWF 0)</span>
        </div>

        <div className="flex items-center justify-between text-base pt-1 font-extrabold">
          <span className="text-slate-900 dark:text-white">Total Charge</span>
          <span className="text-navy-900 dark:text-brand-400 text-lg">
            {formatRWF(total)}
          </span>
        </div>
      </div>

      {/* Phone Number Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          {providerName} Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
            <Smartphone className="w-4 h-4 mr-1 text-slate-400" />
            <span>+250</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="788 123 456"
            className="w-full pl-20 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-base font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-brand-500"
            maxLength={9}
            required
          />
        </div>
        {phoneError ? (
          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {phoneError}
          </p>
        ) : (
          <p className="text-[11px] text-slate-400 mt-1">
            USSD approval prompt will be dispatched to this SIM card.
          </p>
        )}
      </div>

      {/* Security Assurance Banner */}
      <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/40 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
        <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold block text-blue-950 dark:text-blue-100">
            Secure Official Payment Flow
          </span>
          TapGo Rwanda will <span className="font-semibold underline">never</span> ask for your {providerName} PIN inside this application. You will enter your secret PIN exclusively on your phone's official operator USSD push dialog.
        </div>
      </div>

      {/* Demo simulation error trigger */}
      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs flex items-center justify-between">
        <span className="text-slate-500">Simulate Payment Failure?</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={simulateFailure}
            onChange={(e) => setSimulateFailure(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-red-500"></div>
        </label>
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-2">
        <Button
          type="submit"
          variant={isMtn ? "momo" : "airtel"}
          size="lg"
          className="w-full shadow-md text-base"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Continue with {providerName}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="md"
          className="w-full text-slate-500"
          onClick={onBack}
          disabled={isLoading}
        >
          Change Amount or Method
        </Button>
      </div>
    </form>
  );
};
