"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { BottomNavigation } from "./BottomNavigation";
import { DesktopSidebar } from "./DesktopSidebar";
import { Modal } from "@/components/common/Modal";
import { useNotifications } from "@/context/NotificationContext";
import { useApp } from "@/context/AppContext";
import { formatRelativeDate } from "@/lib/formatters";
import { Bell, ArrowDownLeft, Bus, AlertCircle, ShieldAlert, Check, LogIn } from "lucide-react";
import Link from "next/link";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const { notifications, markAllAsRead, markAsRead } = useNotifications();
  const { isAuthenticated } = useApp();

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "top_up":
        return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />;
      case "bus_fare":
        return <Bus className="w-4 h-4 text-[#0B2050] dark:text-cyan-400" />;
      case "low_balance":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-[#00A3E0] selection:text-white">
      {/* Desktop Navigation Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <Header onOpenNotifications={() => setIsNotifModalOpen(true)} />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />

      {/* Notifications Drawer / Modal */}
      <Modal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        title="Notifications"
        description="Your transport wallet and commute alerts"
      >
        <div className="space-y-4">
          {!isAuthenticated ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-[#00A3E0] mx-auto flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Sign in to view notifications
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your top-up receipts, low balance alerts, and trip deductions will appear here once you sign in.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/auth/login"
                  onClick={() => setIsNotifModalOpen(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00A3E0] hover:bg-[#008ec2] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In to TapGo</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-medium">Recent Activity</span>
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs text-[#00A3E0] hover:text-[#008ec2] font-semibold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No notifications yet.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        n.read
                          ? "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-80"
                          : "bg-white dark:bg-slate-850 border-[#00A3E0]/40 dark:border-brand-900/60 shadow-xs"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                          {getNotifIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {n.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {formatRelativeDate(n.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                            {n.message}
                          </p>
                          {n.actionUrl && (
                            <Link
                              href={n.actionUrl}
                              onClick={() => setIsNotifModalOpen(false)}
                              className="inline-block text-[11px] font-bold text-[#00A3E0] mt-1.5 hover:underline"
                            >
                              View Details →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
