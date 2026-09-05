"use client";

import React from "react";
import { TransportCard } from "@/types/card";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { formatRWF, formatRelativeDate } from "@/lib/formatters";
import {
  CreditCard,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

interface CardDetailsModalProps {
  card: TransportCard | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFreeze: (cardId: string) => void;
  onSetPrimary?: (card: TransportCard) => void;
}

export const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  card,
  isOpen,
  onClose,
  onToggleFreeze,
  onSetPrimary,
}) => {
  if (!card) return null;

  const isFrozen = card.status === "frozen";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tap & Go Card Details"
      description={`Manage pass ${card.maskedCardNumber}`}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Card Snapshot Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
              Current Balance
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatRWF(card.balance)}
            </div>
          </div>
          <Badge
            variant={isFrozen ? "error" : "success"}
            size="md"
            dot
          >
            {isFrozen ? "Frozen" : "Active"}
          </Badge>
        </div>

        {/* Detailed Properties Grid */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-400" /> Card Number
            </span>
            <span className="font-mono font-medium text-slate-900 dark:text-white">
              {card.cardNumber.replace(/(\d{4})/g, "$1 ").trim()}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Card Nickname</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {card.nickname || "My Card"}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" /> Registered On
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              {new Date(card.registeredAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {card.lastUsedAt && (
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Last Tap Time
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                {formatRelativeDate(card.lastUsedAt)}
              </span>
            </div>
          )}

          {card.lastUsedRoute && (
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" /> Last Route
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {card.lastUsedRoute}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Default Payment Card</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {card.isPrimary ? "Yes (Primary)" : "No"}
            </span>
          </div>
        </div>

        {/* Security Warning if Frozen */}
        {isFrozen && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-800 dark:text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p>
              This card is temporarily frozen. Bus validators will reject taps until you unfreeze it.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <div className="grid grid-cols-2 gap-2.5">
            <Link href="/top-up" onClick={onClose} className="w-full">
              <Button variant="primary" className="w-full">
                Top Up Card
              </Button>
            </Link>

            <Button
              variant={isFrozen ? "outline" : "danger"}
              onClick={() => onToggleFreeze(card.id)}
              leftIcon={isFrozen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            >
              {isFrozen ? "Unfreeze Card" : "Freeze Card"}
            </Button>
          </div>

          {!card.isPrimary && onSetPrimary && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onSetPrimary(card)}
              leftIcon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
            >
              Set as Primary Card
            </Button>
          )}

          <div className="pt-2 text-center">
            <a
              href="tel:3012"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Report lost/stolen card to RURA / Tap & Go (Toll Free 3012)
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
