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
  LogIn,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNotifications } from "@/context/NotificationContext";
import { formatRWF } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, activeCard, isAuthenticated, isDemoMode, toggleDemoMode, simulateBusRideDeduction } = useApp();
  const { unreadCount } = useNotifications();

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Cards", href: "/cards", icon: CreditCard },
    { label: "Top Up Wallet", href: "/top-up", icon: PlusCircle },
    { label: "Activity & Receipts", href: "/transactions", icon: History },
    { label: "Notifications", href: "/notifications", icon: Bell, badge: isAuthenticated ? unreadCount : 0 },
    { label: "Profile & Settings", href: "/profile", icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 shrink-0 p-5 justify-between">
      {/* Top section */}
      <div className="space-y-6">
        {/* Brand with AC Mobility image */}
        <Link href="/" className="block space-y-2 px-1">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/ac-mobility.png"
              alt="AC Mobility - Smart transport redefined"
              className="h-9 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A3E0]" />
            <span>Tap &amp; Go Transport Wallet</span>
            <span className="text-[10px] px-1 rounded bg-[#00A3E0]/15 text-[#008ec2] font-bold">
              RW
            </span>
          </div>
        </Link>

        {/* Mini Active Card Widget */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800/60 dark:to-slate-900 border border-blue-100 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {isAuthenticated ? "Tap & Go Card" : "Transport Card"}
            </span>
            <span className="text-[11px] font-mono font-bold text-[#00A3E0]">
              {isAuthenticated ? activeCard.maskedCardNumber : "•••• ••••"}
            </span>
          </div>
          <div className="text-xl font-black text-[#0B2050] dark:text-white">
            {isAuthenticated ? formatRWF(activeCard.balance) : "••••••••"}
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
            {isAuthenticated ? (
              <>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Pass
                </span>
                <Link href="/top-up" className="text-[#00A3E0] hover:text-[#008ec2] font-bold">
                  + Top Up
                </Link>
              </>
            ) : (
              <>
                <span className="text-slate-400 font-medium">Logged Out</span>
                <Link href="/auth/login" className="text-[#00A3E0] hover:text-[#008ec2] font-bold">
                  Sign In →
                </Link>
              </>
            )}
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
                    ? "bg-[#0B2050] text-white shadow-sm dark:bg-[#00A3E0]"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-5 h-5", isActive ? "text-[#00A3E0] dark:text-white" : "text-slate-400 dark:text-slate-500")} />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                    isActive ? "bg-white text-[#0B2050]" : "bg-red-500 text-white"
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
        {/* Quick Bus Simulator */}
        {isAuthenticated && (
          <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B2050] dark:text-sky-300 mb-1">
              <Bus className="w-3.5 h-3.5 text-[#00A3E0]" />
              <span>Simulate Bus Boarding</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-2">
              Tap KBS Downtown → Kimironko (-500 RWF).
            </p>
            <button
              type="button"
              onClick={() => simulateBusRideDeduction(500, "Downtown → Kimironko")}
              className="w-full text-xs py-1.5 bg-[#00A3E0] hover:bg-[#008ec2] text-white font-bold rounded-lg transition-colors shadow-xs"
            >
              Tap Bus Validator
            </button>
          </div>
        )}

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

        {/* User Card / Sign In Action */}
        {isAuthenticated && user ? (
          <Link
            href="/profile"
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-[#0B2050] text-white flex items-center justify-center font-bold text-xs shrink-0">
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
        ) : (
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#00A3E0] hover:bg-[#008ec2] text-white font-bold text-xs shadow-sm transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Your Wallet</span>
          </Link>
        )}
      </div>
    </aside>
  );
};
