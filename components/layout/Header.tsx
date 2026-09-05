"use client";

import React from "react";
import Link from "next/link";
import { Bell, MapPin, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNotifications } from "@/context/NotificationContext";

interface HeaderProps {
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const { user, isDemoMode, toggleDemoMode } = useApp();
  const { unreadCount } = useNotifications();

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user.name.split(" ")[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: User Profile info & Greeting */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/profile" className="relative group shrink-0">
            <div className="w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center font-semibold text-sm ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-brand-500 transition-all">
              {firstName.charAt(0)}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>{getGreeting()},</span>
              <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline-flex">
                <MapPin className="w-3 h-3" /> Kigali
              </span>
            </div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {user.name}
            </h1>
          </div>
        </div>

        {/* Right: Demo mode switcher badge & Notification Bell */}
        <div className="flex items-center gap-2.5">
          {/* Demo Mode Toggle Badge */}
          <button
            type="button"
            onClick={toggleDemoMode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100"
            title="Click to toggle Demo / Sandbox simulation mode"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline font-semibold">Mode:</span>
            <span>{isDemoMode ? "Demo" : "Production"}</span>
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
        </div>
      </div>
    </header>
  );
};
