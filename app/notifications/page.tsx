"use client";

import React from "react";
import { useNotifications } from "@/context/NotificationContext";
import { useApp } from "@/context/AppContext";
import { formatRelativeDate } from "@/lib/formatters";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/common/Button";
import {
  Bell,
  CheckCheck,
  Trash2,
  ArrowDownLeft,
  Bus,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  LogIn,
} from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAllAsRead, markAsRead, clearAll } = useNotifications();
  const { isAuthenticated, login } = useApp();

  // If logged out, show sign-in gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
          <Bell className="w-8 h-8 text-[#00A3E0]" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-[#0B2050] dark:text-white">
            Sign In to View Notifications
          </h2>
          <p className="text-xs text-slate-500">
            Log in to your account to view real-time card balance alerts, bus trip receipts, and top-up confirmations.
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

  const getIcon = (type: string) => {
    switch (type) {
      case "top_up":
        return <ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case "bus_fare":
        return <Bus className="w-5 h-5 text-[#0B2050] dark:text-cyan-400" />;
      case "low_balance":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case "card_linked":
        return <CreditCard className="w-5 h-5 text-purple-600" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case "top_up":
        return "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60";
      case "bus_fare":
        return "bg-blue-50 dark:bg-blue-950/40 border-blue-200/60";
      case "low_balance":
        return "bg-amber-50 dark:bg-amber-950/40 border-amber-200/60";
      case "card_linked":
        return "bg-purple-50 dark:bg-purple-950/40 border-purple-200/60";
      default:
        return "bg-slate-100 dark:bg-slate-800 border-slate-200";
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2050] dark:text-white">
            Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Wallet recharges, bus trip deductions, and system alerts
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                leftIcon={<CheckCheck className="w-3.5 h-3.5 text-[#00A3E0]" />}
                className="font-semibold"
              >
                Mark Read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-slate-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! Commute deductions and top-up receipts will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                n.read
                  ? "bg-white/60 dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800 opacity-80"
                  : "bg-white dark:bg-slate-900 border-[#00A3E0]/40 dark:border-brand-800 shadow-card"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${getBg(n.type)}`}>
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {n.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                      {formatRelativeDate(n.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {n.message}
                  </p>

                  {n.actionUrl && (
                    <Link
                      href={n.actionUrl}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#00A3E0] hover:text-[#008ec2] mt-2.5 hover:underline"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-[#00A3E0] shrink-0 mt-1.5" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
