"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CreditCard,
  PlusCircle,
  History,
  User,
  Bell,
  Bus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNotifications } from "@/context/NotificationContext";
import { formatRWF } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, activeCard, isDemoMode, toggleDemoMode, simulateBusRideDeduction } = useApp();
  const { unreadCount } = useNotifications();

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Cards", href: "/cards", icon: CreditCard },
    { label: "Top Up Wallet", href: "/top-up", icon: PlusCircle },
    { label: "Activity & Receipts", href: "/transactions", icon: History },
    { label: "Notifications", href: "/notifications", icon: Bell, badge: unreadCount },
    { label: "Profile & Settings", href: "/profile", icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 shrink-0 p-5 justify-between">
      {/* Top section */}
      <div className="space-y-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-navy-900 dark:bg-brand-600 flex items-center justify-center text-white shadow-md shadow-navy-900/20">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-navy-900 dark:text-white tracking-tight">
                TapGo
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                RW
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Public Transport Wallet</p>
          </div>
        </Link>

        {/* Mini Active Card Widget */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="font-medium">Active Card</span>
            <span className="text-[11px] font-mono font-semibold">{activeCard.maskedCardNumber}</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {formatRWF(activeCard.balance)}
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
            <Link href="/top-up" className="text-brand-600 hover:text-brand-700 dark:text-brand-400 font-semibold">
              + Quick Recharge
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-navy-900 text-white shadow-sm dark:bg-brand-600"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 dark:text-slate-500")} />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                    isActive ? "bg-white text-navy-900" : "bg-red-500 text-white"
                  )}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        {/* Quick Bus Simulator (Demo feature) */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">
            <Bus className="w-3.5 h-3.5 text-blue-600" />
            <span>Simulate Bus Boarding</span>
          </div>
          <p className="text-[11px] text-blue-700 dark:text-blue-400 mb-2">
            Test passenger Tap on KBS Downtown → Kimironko (-500 RWF).
          </p>
          <button
            type="button"
            onClick={() => simulateBusRideDeduction(500, "Downtown → Kimironko")}
            className="w-full text-xs py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Tap Bus Validator
          </button>
        </div>

        {/* Demo Mode Toggle */}
        <button
          type="button"
          onClick={toggleDemoMode}
          className="w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Environment</span>
          </div>
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            {isDemoMode ? "Demo Mode" : "Production"}
          </span>
        </button>

        {/* User Card */}
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
        >
          <div className="w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {user.name}
            </div>
            <div className="text-[11px] text-slate-400 truncate">{user.phone}</div>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        </Link>
      </div>
    </aside>
  );
};
