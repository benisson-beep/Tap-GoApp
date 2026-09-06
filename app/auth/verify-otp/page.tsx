"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";
import { Smartphone, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import Link from "next/link";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone") || "0788123456";
  const { updateUser } = useApp();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleAutoFillDemoOtp = () => {
    setOtp(["1", "2", "3", "4", "5", "6"]);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) return;

    setIsVerifying(true);

    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);

      // Check if registration pending data exists
      if (typeof window !== "undefined") {
        const pending = sessionStorage.getItem("tapgo_pending_registration");
        if (pending) {
          try {
            const data = JSON.parse(pending);
            updateUser({
              name: data.name || "Commuter",
              phone: `+250 ${data.phone}`,
              email: data.email,
            });
            sessionStorage.removeItem("tapgo_pending_registration");
          } catch {
            // ignore
          }
        }
      }

      setTimeout(() => {
        router.push("/");
      }, 1500);
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center max-w-sm mx-auto py-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center mb-4">
        <Smartphone className="w-7 h-7" />
      </div>

      <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
        Verify Your Phone
      </h1>
      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
        We sent a 6-digit verification code via SMS to{" "}
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          +250 {phoneParam}
        </span>
      </p>

      <div className="mt-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        {isSuccess ? (
          <div className="py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-in zoom-in-75 duration-300" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Phone Verified!
            </h3>
            <p className="text-xs text-slate-500">
              Redirecting you to your TapGo transport dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            {/* 6 Digit Inputs */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            {/* Auto-fill demo button */}
            <button
              type="button"
              onClick={handleAutoFillDemoOtp}
              className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
            >
              Demo: Auto-fill Code (123456)
            </button>

            {/* Resend timer */}
            <div className="text-xs text-slate-400">
              {timer > 0 ? (
                <span>Resend code in {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(45)}
                  className="text-brand-600 font-semibold flex items-center justify-center gap-1 mx-auto hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Resend SMS Code
                </button>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-sm"
              disabled={otp.join("").length !== 6}
              isLoading={isVerifying}
            >
              Confirm & Continue
            </Button>
          </form>
        )}
      </div>

      <div className="mt-4 text-center">
        <Link href="/auth/register" className="text-xs text-slate-400 hover:text-slate-600">
          ← Back to Registration
        </Link>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-900"></div>
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
