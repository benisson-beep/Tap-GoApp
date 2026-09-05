"use client";

import React from "react";
import { useNotifications } from "@/context/NotificationContext";
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
} from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAllAsRead, markAsRead, clearAll } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case "top_up":
        return <ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case "bus_fare":
        return <Bus className="w-5 h-5 text-navy-900 dark:text-cyan-400" />;
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
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
                leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
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
                  : "bg-white dark:bg-slate-900 border-brand-300 dark:border-brand-800 shadow-card"
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
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 mt-2.5 hover:underline"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1.5" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
