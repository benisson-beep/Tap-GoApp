"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { TransportCard } from "@/components/cards/TransportCard";
import { CardDetailsModal } from "@/components/cards/CardDetailsModal";
import { LinkCardModal } from "@/components/cards/LinkCardModal";
import { formatRWF, formatMaskedCard } from "@/lib/formatters";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import {
  CreditCard,
  Plus,
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle,
  HelpCircle,
  Clock,
  MapPin,
  ExternalLink,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { TransportCard as TransportCardType } from "@/types/card";

export default function CardsPage() {
  const { cards, activeCard, isAuthenticated, login, setActiveCard, toggleFreezeCard } = useApp();

  const [selectedCardForDetails, setSelectedCardForDetails] = useState<TransportCardType | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // If logged out, show sign-in gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
          <CreditCard className="w-8 h-8 text-[#00A3E0]" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Sign In to Manage Cards
          </h2>
          <p className="text-xs text-slate-500">
            Log in to view your registered Tap &amp; Go passes, check active balances, and link new transport cards.
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

  return (
    <div className="max-w-2xl mx-auto space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2050] dark:text-white">
            My Tap &amp; Go Cards
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your transport smart passes, limits, and security
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsLinkModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-xs bg-[#00A3E0] hover:bg-[#008ec2] text-white font-bold"
        >
          Link Card
        </Button>
      </div>

      {/* Primary Card Showcase */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Primary Travel Pass
          </span>
          <Badge variant="brand" size="sm">
            Default for Commute
          </Badge>
        </div>

        <TransportCard
          card={activeCard}
          onViewDetails={() => setSelectedCardForDetails(activeCard)}
          showActions={true}
        />
      </section>

      {/* Other Registered Cards List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            All Registered Cards ({cards.length})
          </h2>
        </div>

        <div className="space-y-3">
          {cards.map((card) => {
            const isPrimary = card.id === activeCard.id;
            const isFrozen = card.status === "frozen";

            return (
              <div
                key={card.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-card transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs shrink-0">
                      <CreditCard className="w-5 h-5 text-[#00A3E0]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {card.nickname || "Tap & Go Pass"}
                        </h4>
                        {isPrimary && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#008ec2] font-bold">
                            Primary
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                        {formatMaskedCard(card.cardNumber, true)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-black text-[#0B2050] dark:text-white">
                      {formatRWF(card.balance)}
                    </div>
                    <Badge variant={isFrozen ? "error" : "success"} size="sm" dot>
                      {isFrozen ? "Frozen" : "Active"}
                    </Badge>
                  </div>
                </div>

                {/* Card Sub-details */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    {card.lastUsedRoute && (
                      <span className="flex items-center gap-1 text-[11px] truncate max-w-[200px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {card.lastUsedRoute}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFreezeCard(card.id)}
                      className="text-[11px] font-medium text-slate-600 hover:text-red-600 dark:text-slate-300 flex items-center gap-1"
                    >
                      {isFrozen ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {isFrozen ? "Unfreeze" : "Freeze"}
                    </button>

                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => setActiveCard(card)}
                        className="text-[11px] font-medium text-[#00A3E0] hover:text-[#008ec2] flex items-center gap-1 ml-2 font-bold"
                      >
                        <CheckCircle className="w-3 h-3" /> Make Primary
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedCardForDetails(card)}
                      className="text-[11px] font-bold text-[#0B2050] dark:text-slate-200 ml-2 hover:underline"
                    >
                      Inspect →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Helpful Commuter Guide Banner */}
      <section className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <h4 className="font-bold text-slate-900 dark:text-white">
            Need a new Tap &amp; Go physical card?
          </h4>
          <p>
            You can purchase a new card for RWF 1,000 at any AC Mobility / Tap &amp; Go service agent kiosk at Nyabugogo, Kimironko, Remera, or Downtown bus stations.
          </p>
        </div>
      </section>

      {/* Modals */}
      <CardDetailsModal
        card={selectedCardForDetails}
        isOpen={Boolean(selectedCardForDetails)}
        onClose={() => setSelectedCardForDetails(null)}
        onToggleFreeze={toggleFreezeCard}
        onSetPrimary={setActiveCard}
      />

      <LinkCardModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
      />
    </div>
  );
}
