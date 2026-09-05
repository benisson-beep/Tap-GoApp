"use client";

import React, { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";
import { CreditCard, Tag, AlertCircle, CheckCircle2, WifiOff } from "lucide-react";

interface LinkCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LinkCardModal: React.FC<LinkCardModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { linkNewCard } = useApp();

  const [cardNumber, setCardNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Simulation controls for testing validation states
  const [simulateErrorType, setSimulateErrorType] = useState<"none" | "network" | "not_found">("none");

  // Format card number with spaces every 4 digits as user types
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
    if (errorMessage) {
      setErrorMessage(null);
      setErrorCode(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorCode(null);

    const cleanNumber = cardNumber.replace(/\s+/g, "");

    // Quick client format check
    if (cleanNumber.length !== 16) {
      setErrorCode("INVALID_FORMAT");
      setErrorMessage("Please enter the complete 16-digit Tap & Go card number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await linkNewCard(
        { cardNumber: cleanNumber, nickname },
        {
          simulateNetworkError: simulateErrorType === "network",
          simulateNotFound: simulateErrorType === "not_found",
        }
      );

      if (res.valid) {
        setIsSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        setErrorCode(res.code);
        setErrorMessage(res.message);
      }
    } catch {
      setErrorCode("NETWORK_ERROR");
      setErrorMessage("Network error: Could not reach card verification servers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCardNumber("");
    setNickname("");
    setIsSuccess(false);
    setErrorMessage(null);
    setErrorCode(null);
    setSimulateErrorType("none");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={isSuccess ? "Card Linked!" : "Link your Tap & Go card"}
      description={
        isSuccess
          ? "Your pass is ready for boarding Kigali buses"
          : "Add your Tap & Go card to manage your balance and transport activity from one place."
      }
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mx-auto flex items-center justify-center animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Card Successfully Linked
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              Your Tap & Go card has been linked successfully. You can now view its balance and recharge via MTN MoMo or Airtel Money.
            </p>
          </div>
          <Button variant="primary" size="lg" className="w-full" onClick={handleResetAndClose}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Number Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Tap & Go Card Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="9400 1234 5678 9012"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-brand-500 focus:border-transparent transition-all"
                maxLength={19} // 16 digits + 3 spaces
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Printed on the front of your plastic card (starts with 9400...)
            </p>
          </div>

          {/* Nickname Input (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Card Nickname <span className="text-slate-400 text-[10px] lowercase">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Work Commute, School Pass"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-brand-500 focus:border-transparent transition-all"
                maxLength={30}
              />
            </div>
          </div>

          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              {errorCode === "NETWORK_ERROR" ? (
                <WifiOff className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <span className="font-semibold block">{errorMessage}</span>
                {errorCode === "CARD_NOT_FOUND" && (
                  <span className="text-[11px] text-red-600 dark:text-red-400 mt-0.5 block">
                    Please make sure your card has been activated at any Kigali bus park agent before linking.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Sandbox validation simulator toggles */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <details className="text-xs text-slate-500">
              <summary className="cursor-pointer font-medium hover:text-slate-700 select-none py-1">
                🛠️ Demo: Test validation edge cases
              </summary>
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCardNumber("9400 1020 3040 4821")}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] hover:bg-slate-200"
                >
                  Test Already Registered
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCardNumber("9400 9999 9999 0000");
                    setSimulateErrorType("not_found");
                  }}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] hover:bg-slate-200"
                >
                  Test Card Not Found
                </button>
                <button
                  type="button"
                  onClick={() => setSimulateErrorType("network")}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] hover:bg-slate-200"
                >
                  Test Network Error
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const rand = Math.floor(1000 + Math.random() * 9000);
                    setCardNumber(`9400 5511 2233 ${rand}`);
                    setSimulateErrorType("none");
                  }}
                  className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold hover:bg-emerald-100"
                >
                  Generate Valid Card
                </button>
              </div>
            </details>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
            >
              Link Card
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
