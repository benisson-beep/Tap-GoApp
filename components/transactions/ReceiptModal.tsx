"use client";

import React, { useState } from "react";
import { Transaction } from "@/types/transaction";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { formatRWF, formatMaskedCard } from "@/lib/formatters";
import { transactionService } from "@/services/transactions/transaction-service";
import {
  Download,
  Share2,
  CheckCircle2,
  Bus,
  ArrowDownLeft,
  Calendar,
  Clock,
  CreditCard,
  Hash,
  FileCheck,
  Check,
} from "lucide-react";

interface ReceiptModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!transaction) return null;

  const isTopUp = transaction.type === "top_up";
  const dateObj = new Date(transaction.timestamp);

  const handleDownload = () => {
    setIsDownloading(true);
    const content = transactionService.generateReceiptContent(transaction);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Receipt_${transaction.receiptNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setIsDownloading(false);
    }, 600);
  };

  const handleShare = async () => {
    const shareText = `TapGo Rwanda Official Receipt\nTx: ${transaction.receiptNumber}\nAmount: RWF ${Math.abs(transaction.amount)}\nCard: ${transaction.maskedCardNumber}\nStatus: ${transaction.status.toUpperCase()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `TapGo Receipt ${transaction.receiptNumber}`,
          text: shareText,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Receipt"
      description={`Receipt No: ${transaction.receiptNumber}`}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Receipt Container Card */}
        <div className="relative p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          {/* Header watermark/seal */}
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-navy-900 dark:bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                TG
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                  TapGo Rwanda
                </h4>
                <span className="text-[10px] text-slate-500 font-medium">
                  Official Transport Receipt
                </span>
              </div>
            </div>

            <Badge variant={transaction.status === "completed" ? "success" : "error"} dot>
              {transaction.status.toUpperCase()}
            </Badge>
          </div>

          {/* Amount Showcase */}
          <div className="text-center py-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">
              {isTopUp ? "Amount Recharged" : "Bus Commute Fare"}
            </span>
            <div
              className={`text-3xl font-extrabold tracking-tight mt-0.5 ${
                isTopUp ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"
              }`}
            >
              {isTopUp ? `+${formatRWF(transaction.amount)}` : formatRWF(transaction.amount)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Card Balance After: <strong className="text-slate-700 dark:text-slate-200">{formatRWF(transaction.balanceAfter)}</strong>
            </span>
          </div>

          {/* Detailed Itemized Rows */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" /> Transaction Type
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {isTopUp ? "Mobile Wallet Top-Up" : "City Bus Boarding Fare"}
              </span>
            </div>

            {transaction.route && (
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Bus className="w-3.5 h-3.5 text-slate-400" /> Route
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                  {transaction.route}
                </span>
              </div>
            )}

            {transaction.busOperator && (
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 dark:text-slate-400">Bus Operator</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {transaction.busOperator} {transaction.busPlate ? `(${transaction.busPlate})` : ""}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Tap & Go Card
              </span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                {formatMaskedCard(transaction.maskedCardNumber, true)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400">Payment Method</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {transaction.paymentMethod === "mtn_momo"
                  ? "MTN MoMo"
                  : transaction.paymentMethod === "airtel_money"
                  ? "Airtel Money"
                  : "Tap & Go Card Balance"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date & Time
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                {dateObj.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                at{" "}
                {dateObj.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            </div>

            {transaction.providerReference && (
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 dark:text-slate-400">Provider Ref</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {transaction.providerReference}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400">Regulatory Compliance</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                RURA Verified
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={handleDownload}
            isLoading={isDownloading}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download Receipt
          </Button>

          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={handleShare}
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          >
            {copied ? "Copied!" : "Share Receipt"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
