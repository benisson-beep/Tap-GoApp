"use client";

import React from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { PaymentResult, PaymentStatus } from "@/types/payment";
import { formatRWF, formatRelativeDate } from "@/lib/formatters";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Smartphone,
  Receipt,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface PaymentStatusModalProps {
  isOpen: boolean;
  status: PaymentStatus;
  result: PaymentResult | null;
  newBalance?: number;
  onDone: () => void;
  onTryAgain: () => void;
  onSelectAnotherMethod: () => void;
  onViewReceipt?: () => void;
}

export const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({
  isOpen,
  status,
  result,
  newBalance,
  onDone,
  onTryAgain,
  onSelectAnotherMethod,
  onViewReceipt,
}) => {
  if (!isOpen) return null;

  const isProcessing = status === "processing" || status === "pending_approval" || status === "initiating";
  const isSuccess = status === "successful";
  const isFailed = status === "failed" || status === "cancelled";

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isProcessing) onDone();
      }}
      maxWidth="md"
      showCloseButton={!isProcessing}
    >
      {/* 1. PROCESSING / USSD PUSH STATE */}
      {isProcessing && (
        <div className="py-6 text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            {/* Pulsing radar circles */}
            <div className="absolute inset-0 rounded-full bg-brand-500/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-navy-900 text-white flex items-center justify-center shadow-lg shadow-navy-900/30">
              <Smartphone className="w-9 h-9 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2 max-w-xs mx-auto">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Approve on Your Phone
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              A USSD push notification was dispatched to your mobile. Please authorize the transaction by entering your PIN on your device.
            </p>
          </div>

          {/* Operator USSD mockup notice */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 font-mono flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-navy-900 dark:text-brand-400" />
            <span>Waiting for operator authorization...</span>
          </div>
        </div>
      )}

      {/* 2. SUCCESSFUL STATE */}
      {isSuccess && result && (
        <div className="py-4 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mx-auto flex items-center justify-center animate-in zoom-in-75 duration-300 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Top Up Successful
            </h3>
            <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              +{formatRWF(result.amount)} added to your Tap & Go card
            </p>
          </div>

          {/* Receipt summary card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-left space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400">New Card Balance</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {formatRWF(newBalance ?? 0)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400">Transaction ID</span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                {result.transactionId}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400">Destination Card</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                {result.maskedCardNumber}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400">Date & Time</span>
              <span className="text-slate-700 dark:text-slate-300">
                {formatRelativeDate(result.timestamp)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500 dark:text-slate-400">Provider Ref</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {result.providerReference}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={onDone}
            >
              Done
            </Button>

            {onViewReceipt && (
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={onViewReceipt}
                leftIcon={<Receipt className="w-4 h-4" />}
              >
                View & Download Receipt
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 3. FAILED STATE */}
      {isFailed && (
        <div className="py-4 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 mx-auto flex items-center justify-center animate-in zoom-in-75 duration-300">
            <XCircle className="w-10 h-10" />
          </div>

          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Payment Unsuccessful
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {result?.errorMessage ||
                "Your mobile money transaction could not be completed. No funds were deducted from your wallet."}
            </p>
          </div>

          {/* Helpful suggestions */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-left text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <span className="font-semibold block">Suggested Checks:</span>
            <ul className="list-disc list-inside space-y-0.5 text-amber-800 dark:text-amber-300">
              <li>Ensure your MoMo/Airtel wallet has sufficient balance</li>
              <li>Check that you approved the prompt within 60 seconds</li>
              <li>Verify that your SIM card network has strong signal</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={onTryAgain}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Try Again
            </Button>

            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={onSelectAnotherMethod}
            >
              Choose Another Method
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
