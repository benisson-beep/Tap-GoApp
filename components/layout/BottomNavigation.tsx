"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, History, User, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Cards", href: "/cards", icon: CreditCard },
    { label: "Top Up", href: "/top-up", icon: PlusCircle, highlight: true },
    { label: "Activity", href: "/transactions", icon: History },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 pb-safe">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-3 group"
              >
                <div className="w-12 h-12 rounded-full bg-navy-900 dark:bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-navy-900/20 dark:shadow-brand-600/30 group-active:scale-95 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-semibold text-navy-900 dark:text-brand-400 mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors relative py-1",
                isActive
                  ? "text-navy-900 dark:text-white font-semibold"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110 text-navy-900 dark:text-brand-400")} />
              <span className="text-[11px]">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-navy-900 dark:bg-brand-400 absolute bottom-1" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
