"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Modal } from "@/components/common/Modal";
import { formatMaskedCard } from "@/lib/formatters";
import {
  User,
  Phone,
  Mail,
  CreditCard,
  Shield,
  Fingerprint,
  Bell,
  Globe,
  Moon,
  Sun,
  FileText,
  HelpCircle,
  LogOut,
  RotateCcw,
  Sparkles,
  Check,
  ChevronRight,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  Building2,
  LogIn,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    activeCard,
    isAuthenticated,
    logout,
    login,
    isDemoMode,
    toggleDemoMode,
    updateUser,
    resetToMockData,
  } = useApp();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: editName,
      phone: editPhone,
      email: editEmail,
    });
    setIsEditProfileOpen(false);
    setFeedbackMsg("Profile updated successfully");
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleToggleBiometrics = () => {
    if (user) {
      updateUser({ biometricsEnabled: !user.biometricsEnabled });
    }
  };

  const handleLanguageChange = (lang: "en" | "rw" | "fr") => {
    updateUser({ preferredLanguage: lang });
    setFeedbackMsg(`Language updated to ${lang.toUpperCase()}`);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleExecuteLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    router.push("/auth/login");
  };

  // If user is logged out, show clean login prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            You are logged out
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to view your profile credentials, registered passes, and wallet security settings.
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B2050] dark:text-white">
          Profile &amp; Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Account credentials, security, and application preferences
        </p>
      </div>

      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" /> {feedbackMsg}
        </div>
      )}

      {/* Profile Overview Card */}
      <section className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0B2050] to-[#00A3E0] text-white flex items-center justify-center font-black text-2xl ring-4 ring-slate-100 dark:ring-slate-800 shadow-md">
            {user.name.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                {user.name}
              </h2>
              <Badge variant="success" size="sm" dot>
                Verified Passenger
              </Badge>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}
              </span>
            </div>

            <div className="mt-2 text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#00A3E0]" />
              <span>Primary Card: <strong className="text-slate-700 dark:text-slate-300 font-mono">{formatMaskedCard(activeCard.cardNumber)}</strong></span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditName(user.name);
              setEditPhone(user.phone);
              setEditEmail(user.email);
              setIsEditProfileOpen(true);
            }}
            className="shrink-0 font-semibold"
          >
            Edit Profile
          </Button>
        </div>
      </section>

      {/* Official AC Mobility Network Card */}
      <section className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/40 dark:from-slate-900 dark:to-slate-850 border border-sky-100 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <img
                src="/images/ac-mobility.png"
                alt="AC Mobility"
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
              TapGo Rwanda runs on the official <strong>AC Mobility Rwanda</strong> transit network powering Tap &amp; Go cards across all Kigali bus fleets.
            </p>
          </div>
          <div className="text-right shrink-0 hidden sm:block">
            <span className="text-[10px] uppercase font-bold text-[#00A3E0] tracking-wider block">
              Operator
            </span>
            <span className="text-xs font-black text-[#0B2050] dark:text-white">
              AC Mobility Rwanda
            </span>
          </div>
        </div>
      </section>

      {/* Security & Authentication */}
      <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Security &amp; Access
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          {/* Biometrics */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Biometric Login
                </span>
                <span className="text-xs text-slate-500">
                  Fingerprint or Face ID for fast login
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.biometricsEnabled}
                onChange={handleToggleBiometrics}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A3E0]"></div>
            </label>
          </div>

          {/* Security PIN */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#163B82]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  App Access PIN
                </span>
                <span className="text-xs text-slate-500">
                  4-digit security code configured
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-[#00A3E0] font-bold">
              Change PIN
            </Button>
          </div>
        </div>
      </section>

      {/* Preferences & Language */}
      <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Preferences
        </h3>

        <div className="space-y-3 text-sm">
          {/* Language Selector */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Language / Ururimi
                </span>
                <span className="text-xs text-slate-500">
                  Select your preferred interface language
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  user.preferredLanguage === "en"
                    ? "bg-[#00A3E0] text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("rw")}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  user.preferredLanguage === "rw"
                    ? "bg-[#00A3E0] text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                RW
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("fr")}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  user.preferredLanguage === "fr"
                    ? "bg-[#00A3E0] text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                FR
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Developer & Integration Environment Control */}
      <section className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Integration Architecture Mode
              </h3>
              <p className="text-xs text-slate-500">
                Currently running in: <strong className="text-amber-700 dark:text-amber-400">{isDemoMode ? "DEMO MODE (Mock Payments)" : "PRODUCTION MODE (Live APIs)"}</strong>
              </p>
            </div>
          </div>

          <Button
            variant={isDemoMode ? "outline" : "primary"}
            size="sm"
            onClick={toggleDemoMode}
            className="font-bold"
          >
            Switch to {isDemoMode ? "Production" : "Demo"}
          </Button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {isDemoMode
            ? "In Demo Mode, wallet top-ups simulate realistic Kigali MTN MoMo & Airtel Money USSD push authorization, status polling, and instant balance creation without charging actual bank funds."
            : "In Production Mode, requests are routed to the MTN MoMo and Airtel Money provider endpoints using official merchant credentials."}
        </p>

        <div className="pt-2 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={resetToMockData}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 underline font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset all local demo data
          </button>
        </div>
      </section>

      {/* Legal, Support & Logout */}
      <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
        <button
          type="button"
          onClick={() => setIsTermsModalOpen(true)}
          className="w-full flex items-center justify-between py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Terms &amp; Public Transport Conditions</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => setIsPrivacyModalOpen(true)}
          className="w-full flex items-center justify-between py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 transition-colors border-t border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Privacy Policy (Rwanda Law N° 058/2021 Compliant)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <a
          href="tel:3012"
          className="w-full flex items-center justify-between py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 transition-colors border-t border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>AC Mobility &amp; RURA Support (Toll Free 3012)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </a>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="ghost"
            className="w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 justify-center font-bold"
            onClick={() => setIsLogoutModalOpen(true)}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Log Out of TapGo
          </Button>
        </div>
      </section>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Commuter Profile"
        description="Update your contact information"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              required
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" className="w-full font-bold">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
        description="Are you sure you want to log out?"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-1">
          <p className="text-xs text-slate-500">
            Logging out will clear your active balance and card credentials from this device. You will need your PIN to sign back in.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              className="w-full"
              onClick={handleExecuteLogout}
            >
              Log Out
            </Button>
          </div>
        </div>
      </Modal>

      {/* Terms Modal */}
      <Modal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        title="Terms &amp; Conditions"
        description="TapGo Rwanda Commuter Agreement"
      >
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
          <p>
            1. <strong>Card Usage:</strong> Tap &amp; Go passes issued by AC Mobility Rwanda remain valid across all designated Kigali city public buses (KBS, Royal Express, Jali Transport).
          </p>
          <p>
            2. <strong>Fares &amp; Compliance:</strong> Bus fares are regulated by the Rwanda Utilities Regulatory Authority (RURA). Passengers must tap in upon boarding each bus trip.
          </p>
          <p>
            3. <strong>Wallet Top-ups:</strong> Mobile money recharges through MTN MoMo and Airtel Money are processed instantly without additional surcharge to the passenger.
          </p>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="Privacy Policy"
        description="Rwanda Law N° 058/2021 on Personal Data Protection"
      >
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
          <p>
            TapGo Rwanda complies strictly with Rwanda Law N° 058/2021 of 13/10/2021 relating to the protection of personal data and privacy.
          </p>
          <p>
            We do not store or process sensitive payment PINs or private mobile banking credentials. Mobile money authorizations are conducted exclusively through official operator channels.
          </p>
        </div>
      </Modal>
    </div>
  );
}
