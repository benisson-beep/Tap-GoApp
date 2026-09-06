"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AmountSelector } from "@/components/topup/AmountSelector";
import { PaymentMethodCard } from "@/components/topup/PaymentMethodCard";
import { PaymentConfirmation } from "@/components/topup/PaymentConfirmation";
import { PaymentStatusModal } from "@/components/topup/PaymentStatusModal";
import { ReceiptModal } from "@/components/transactions/ReceiptModal";
import { PAYMENT_METHODS } from "@/data/mock-data";
import { PaymentProviderType, PaymentStatus, PaymentResult } from "@/types/payment";
import { paymentService } from "@/services/payment";
import { formatRWF, formatMaskedCard } from "@/lib/formatters";
import { Button } from "@/components/common/Button";
import { Transaction } from "@/types/transaction";
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle2, LogIn, PlusCircle } from "lucide-react";
import Link from "next/link";

type TopUpStep = "amount_and_method" | "confirmation";

export default function TopUpPage() {
  const { activeCard, user, isAuthenticated, login, isDemoMode, topUpActiveCard, transactions } = useApp();

  const [step, setStep] = useState<TopUpStep>("amount_and_method");
  const [selectedAmount, setSelectedAmount] = useState<number>(5000);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProviderType>("mtn_momo");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [newBalance, setNewBalance] = useState<number>(activeCard.balance);
  const [createdTxId, setCreatedTxId] = useState<string | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // If logged out, show sign-in gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
          <PlusCircle className="w-8 h-8 text-[#00A3E0]" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Sign In to Top Up Wallet
          </h2>
          <p className="text-xs text-slate-500">
            Log in to your account to recharge your Tap &amp; Go transport card using MTN MoMo or Airtel Money.
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

  const isAmountValid = selectedAmount >= 500 && selectedAmount <= 100000;

  const handleProceedToConfirm = () => {
    if (isAmountValid) {
      setStep("confirmation");
    }
  };

  const handleExecutePayment = async (phoneNumber: string, simulateFailure = false) => {
    setPaymentStatus("initiating");

    try {
      setPaymentStatus("processing");

      const result = await paymentService.processTopUp(
        {
          cardId: activeCard.id,
          cardNumber: activeCard.cardNumber,
          amount: selectedAmount,
          provider: selectedProvider,
          phoneNumber,
          metadata: {
            commuterName: user?.name || "Passenger",
            simulateFailure,
          },
        },
        isDemoMode
      );

      setPaymentResult(result);

      if (result.success) {
        const topUpRes = await topUpActiveCard(
          result.amount,
          result.provider as "mtn_momo" | "airtel_money",
          result.providerReference,
          phoneNumber
        );

        setNewBalance(topUpRes.newBalance);
        setCreatedTxId(topUpRes.txId);
        setPaymentStatus("successful");
      } else {
        setPaymentStatus("failed");
      }
    } catch (err: any) {
      setPaymentResult({
        success: false,
        status: "failed",
        transactionId: `TXN-ERR-${Date.now()}`,
        providerReference: "FAILED",
        amount: selectedAmount,
        fee: 0,
        total: selectedAmount,
        currency: "RWF",
        provider: selectedProvider,
        phoneNumber,
        cardId: activeCard.id,
        maskedCardNumber: activeCard.maskedCardNumber,
        timestamp: new Date().toISOString(),
        errorMessage: err.message || "An unexpected network error occurred while reaching the payment gateway.",
      });
      setPaymentStatus("failed");
    }
  };

  const handleResetFlow = () => {
    setPaymentStatus("idle");
    setPaymentResult(null);
    setStep("amount_and_method");
  };

  const latestTransaction = transactions.find((t) => t.id === createdTxId) || null;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Top Bar / Back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {step === "confirmation" && (
            <button
              type="button"
              onClick={() => setStep("amount_and_method")}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-[#0B2050] dark:text-white">
              {step === "confirmation" ? "Review & Confirm Top Up" : "Top Up Tap & Go"}
            </h1>
            <p className="text-xs text-slate-500">
              {step === "confirmation"
                ? "Verify details before initiating phone authorization"
                : "Add funds to your transport card via Mobile Money"}
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
        >
          Cancel
        </Link>
      </div>

      {/* Target Card & Current Balance Pill */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B2050] text-white flex items-center justify-center font-bold text-xs shrink-0">
            TG
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Card to Recharge</span>
            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
              {formatMaskedCard(activeCard.cardNumber)}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block font-medium">Current Balance</span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {formatRWF(activeCard.balance)}
          </span>
        </div>
      </div>

      {/* Step 1: Select Amount & Provider */}
      {step === "amount_and_method" && (
        <div className="space-y-6">
          <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <AmountSelector
              selectedAmount={selectedAmount}
              onSelectAmount={setSelectedAmount}
            />
          </section>

          <section className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 px-1">
              Choose Payment Method
            </label>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  isSelected={selectedProvider === method.id}
                  onSelect={setSelectedProvider}
                />
              ))}
            </div>
          </section>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full text-base shadow-md bg-[#00A3E0] hover:bg-[#008ec2] text-white font-bold"
              disabled={!isAmountValid}
              onClick={handleProceedToConfirm}
            >
              Review Top Up ({formatRWF(selectedAmount)})
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Confirmation & Phone Number Input */}
      {step === "confirmation" && (
        <PaymentConfirmation
          card={activeCard}
          amount={selectedAmount}
          provider={selectedProvider}
          defaultPhone={user?.phone || "+250788123456"}
          onConfirm={handleExecutePayment}
          onBack={() => setStep("amount_and_method")}
          isLoading={paymentStatus === "initiating" || paymentStatus === "processing"}
        />
      )}

      {/* Status Modal */}
      <PaymentStatusModal
        isOpen={paymentStatus !== "idle"}
        status={paymentStatus}
        result={paymentResult}
        newBalance={newBalance}
        onDone={() => {
          setPaymentStatus("idle");
          window.location.href = "/";
        }}
        onTryAgain={() => {
          setPaymentStatus("idle");
          setStep("confirmation");
        }}
        onSelectAnotherMethod={handleResetFlow}
        onViewReceipt={() => setIsReceiptModalOpen(true)}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        transaction={latestTransaction}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
    </div>
  );
}
