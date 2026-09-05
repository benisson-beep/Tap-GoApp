"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/common/Button";
import { authService } from "@/services/auth/auth-service";
import { Bus, Smartphone, Lock, Fingerprint, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { updateUser } = useApp();

  const [phone, setPhone] = useState("0788123456");
  const [pin, setPin] = useState("1234");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const session = await authService.loginWithPhone(phone, pin);
      updateUser(session.user);
      router.push("/");
    } catch {
      setError("Invalid phone number or PIN. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setPhone("0788123456");
    setPin("1234");
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center max-w-sm mx-auto py-8">
      {/* Brand Icon & Heading */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-navy-900 dark:bg-brand-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-navy-900/20 mb-3">
          <Bus className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Welcome to TapGo
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Rwanda's smart public transport wallet
        </p>
      </div>

      {/* Login Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Smartphone className="w-4 h-4 mr-1 text-slate-400" />
                <span className="text-xs font-bold text-slate-500">+250</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="788 123 456"
                className="w-full pl-20 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-900"
                required
              />
            </div>
          </div>

          {/* PIN / Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Security PIN
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-[11px] font-semibold text-brand-600 hover:underline"
              >
                Forgot PIN?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                maxLength={6}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-900 tracking-widest"
                required
              />
            </div>
          </div>

          {/* Quick Demo Pre-fill helper */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="w-full py-1.5 px-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-[11px] font-semibold text-amber-800 dark:text-amber-300 flex items-center justify-center gap-1.5 hover:bg-amber-100"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Fill Demo Commuter (Jean Bosco)</span>
            </button>
          </div>

          <div className="pt-2 space-y-2.5">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-sm"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>

            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full"
              onClick={handleLogin}
              leftIcon={<Fingerprint className="w-4 h-4 text-purple-600" />}
            >
              Biometric Sign In
            </Button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
          Don't have a TapGo account?{" "}
          <Link href="/auth/register" className="font-bold text-navy-900 dark:text-brand-400 hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
