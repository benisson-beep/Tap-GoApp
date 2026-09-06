"use client";

import React from "react";
import Link from "next/link";
import { Bell, MapPin, Sparkles, LogIn, User } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNotifications } from "@/context/NotificationContext";

interface HeaderProps {
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const { user, isAuthenticated, isDemoMode, toggleDemoMode } = useApp();
  const { unreadCount } = useNotifications();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "Commuter";

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: User Profile info / Sign In CTA */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/profile" className="relative group shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#0B2050] text-white flex items-center justify-center font-bold text-sm ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-[#00A3E0] transition-all">
                {firstName.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>{getGreeting()},</span>
                <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline-flex">
                  <MapPin className="w-3 h-3 text-[#00A3E0]" /> Kigali
                </span>
              </div>
              <h1 className="text-base font-extrabold text-[#0B2050] dark:text-white truncate">
                {user.name}
              </h1>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400 block">Welcome,</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                TapGo Passenger
              </span>
            </div>
          </div>
        )}

        {/* Center: AC Mobility Brand Badge */}
        <div className="hidden sm:flex md:hidden items-center">
          <img
            src="/images/ac-mobility.png"
            alt="AC Mobility"
            className="h-7 w-auto object-contain"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile AC Mobility badge */}
          <div className="sm:hidden flex items-center shrink-0">
            <img
              src="/images/ac-mobility.png"
              alt="AC Mobility"
              className="h-6 w-auto object-contain"
            />
          </div>

          {!isAuthenticated ? (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00A3E0] hover:bg-[#008ec2] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          ) : (
            <>
              {/* Demo Mode Toggle Badge */}
              <button
                type="button"
                onClick={toggleDemoMode}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold border transition-colors bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100"
                title="Click to toggle Demo / Sandbox simulation mode"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline font-bold">Mode:</span>
                <span>{isDemoMode ? "Demo" : "Live"}</span>
              </button>

              {/* Notifications Button */}
              <Link
                href="/notifications"
                onClick={(e) => {
                  if (onOpenNotifications) {
                    e.preventDefault();
                    onOpenNotifications();
                  }
                }}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
