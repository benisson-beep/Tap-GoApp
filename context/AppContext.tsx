"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "@/types/user";
import { TransportCard, CardValidationResult, LinkCardRequest } from "@/types/card";
import { Transaction } from "@/types/transaction";
import { MOCK_USER, MOCK_CARDS, MOCK_TRANSACTIONS } from "@/data/mock-data";
import { cardService } from "@/services/cards/card-service";
import { useNotifications } from "./NotificationContext";
import { formatRWF } from "@/lib/formatters";

export const UNLINKED_CARD: TransportCard = {
  id: "card_unlinked",
  userId: "",
  cardNumber: "0000000000000000",
  maskedCardNumber: "•••• ••••",
  nickname: "No Card Linked",
  balance: 0,
  status: "unregistered",
  isPrimary: false,
  registeredAt: "",
};

interface AppContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  cards: TransportCard[];
  activeCard: TransportCard;
  transactions: Transaction[];
  isDemoMode: boolean;
  isLoading: boolean;
  login: (profile?: Partial<UserProfile>) => void;
  logout: () => void;
  setActiveCard: (card: TransportCard) => void;
  topUpActiveCard: (
    amount: number,
    method: "mtn_momo" | "airtel_money",
    providerRef: string,
    phone: string
  ) => Promise<{ success: boolean; newBalance: number; txId: string }>;
  linkNewCard: (
    request: LinkCardRequest,
    options?: { simulateNetworkError?: boolean; simulateNotFound?: boolean }
  ) => Promise<CardValidationResult>;
  toggleFreezeCard: (cardId: string) => void;
  updateUser: (profile: Partial<UserProfile>) => void;
  toggleDemoMode: () => void;
  simulateBusRideDeduction: (fare?: number, route?: string) => void;
  resetToMockData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addNotification } = useNotifications();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const authFlag = localStorage.getItem("tapgo_auth_logged_in");
      if (authFlag !== null) {
        return authFlag === "true";
      }
    }
    return true; // Default start
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const authFlag = localStorage.getItem("tapgo_auth_logged_in");
      if (authFlag === "false") return null;
      const saved = localStorage.getItem("tapgo_user");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return MOCK_USER;
        }
      }
    }
    return MOCK_USER;
  });

  const [cards, setCards] = useState<TransportCard[]>(() => {
    if (typeof window !== "undefined") {
      const authFlag = localStorage.getItem("tapgo_auth_logged_in");
      if (authFlag === "false") return [];
      const saved = localStorage.getItem("tapgo_cards");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return MOCK_CARDS;
        }
      }
    }
    return MOCK_CARDS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== "undefined") {
      const authFlag = localStorage.getItem("tapgo_auth_logged_in");
      if (authFlag === "false") return [];
      const saved = localStorage.getItem("tapgo_transactions");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return MOCK_TRANSACTIONS;
        }
      }
    }
    return MOCK_TRANSACTIONS;
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Active card: primary card or first card, or unlinked blank card when logged out
  const activeCard =
    isAuthenticated && cards.length > 0
      ? cards.find((c) => c.isPrimary) || cards[0]
      : UNLINKED_CARD;

  useEffect(() => {
    if (user && isAuthenticated) {
      localStorage.setItem("tapgo_user", JSON.stringify(user));
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("tapgo_cards", JSON.stringify(cards));
    }
  }, [cards, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("tapgo_transactions", JSON.stringify(transactions));
    }
  }, [transactions, isAuthenticated]);

  const login = (profile?: Partial<UserProfile>) => {
    const loggedInUser: UserProfile = profile
      ? { ...MOCK_USER, ...profile }
      : MOCK_USER;
    setIsAuthenticated(true);
    setUser(loggedInUser);
    setCards(MOCK_CARDS);
    setTransactions(MOCK_TRANSACTIONS);
    if (typeof window !== "undefined") {
      localStorage.setItem("tapgo_auth_logged_in", "true");
      localStorage.setItem("tapgo_user", JSON.stringify(loggedInUser));
      localStorage.setItem("tapgo_cards", JSON.stringify(MOCK_CARDS));
      localStorage.setItem("tapgo_transactions", JSON.stringify(MOCK_TRANSACTIONS));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCards([]);
    setTransactions([]);
    if (typeof window !== "undefined") {
      localStorage.setItem("tapgo_auth_logged_in", "false");
      localStorage.removeItem("tapgo_user");
      localStorage.removeItem("tapgo_cards");
      localStorage.removeItem("tapgo_transactions");
      localStorage.removeItem("tapgo_session_v1");
    }
  };

  const setActiveCard = (cardToSet: TransportCard) => {
    setCards((prev) =>
      prev.map((c) => ({
        ...c,
        isPrimary: c.id === cardToSet.id,
      }))
    );
  };

  const topUpActiveCard = async (
    amount: number,
    method: "mtn_momo" | "airtel_money",
    providerRef: string,
    phone: string
  ): Promise<{ success: boolean; newBalance: number; txId: string }> => {
    const newBalance = activeCard.balance + amount;
    const now = new Date().toISOString();
    const txId = `tx_${Date.now()}`;
    const receiptNo = `TG-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTransaction: Transaction = {
      id: txId,
      userId: user?.id || "usr_guest",
      cardId: activeCard.id,
      maskedCardNumber: activeCard.maskedCardNumber,
      type: "top_up",
      amount: amount,
      currency: "RWF",
      status: "completed",
      description: method === "mtn_momo" ? "MTN MoMo Top Up" : "Airtel Money Top Up",
      paymentMethod: method,
      providerReference: providerRef,
      timestamp: now,
      fee: 0,
      balanceAfter: newBalance,
      receiptNumber: receiptNo,
    };

    setCards((prev) =>
      prev.map((c) => (c.id === activeCard.id ? { ...c, balance: newBalance } : c))
    );

    setTransactions((prev) => [newTransaction, ...prev]);

    addNotification({
      type: "top_up",
      title: "Top Up Successful",
      message: `Your Tap & Go card (${activeCard.maskedCardNumber}) was topped up with ${formatRWF(amount)} via ${method === "mtn_momo" ? "MTN MoMo" : "Airtel Money"}.`,
      amount,
      actionUrl: "/transactions",
    });

    return { success: true, newBalance, txId };
  };

  const linkNewCard = async (
    request: LinkCardRequest,
    options?: { simulateNetworkError?: boolean; simulateNotFound?: boolean }
  ): Promise<CardValidationResult> => {
    setIsLoading(true);
    try {
      const result = await cardService.validateAndLinkCard(request, cards, options);
      if (result.valid && result.card) {
        const newCard = result.card as TransportCard;
        setCards((prev) => [...prev, newCard]);
        addNotification({
          type: "card_linked",
          title: "New Card Linked",
          message: `Your Tap & Go card (${newCard.maskedCardNumber}) has been added to your transport wallet.`,
          actionUrl: "/cards",
        });
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFreezeCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const newStatus = c.status === "frozen" ? "active" : "frozen";
          addNotification({
            type: "security",
            title: newStatus === "frozen" ? "Card Frozen" : "Card Unfrozen",
            message: `Tap & Go card ${c.maskedCardNumber} is now ${newStatus}.`,
            actionUrl: "/cards",
          });
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const simulateBusRideDeduction = (fare = 500, route = "Kigali Downtown → Kimironko") => {
    if (!isAuthenticated) return;

    if (activeCard.balance < fare) {
      addNotification({
        type: "low_balance",
        title: "Insufficient Balance for Bus Ride",
        message: `Tap & Go card failed tap: balance (${formatRWF(activeCard.balance)}) is less than route fare (${formatRWF(fare)}).`,
        actionUrl: "/top-up",
      });
      return;
    }

    const newBal = activeCard.balance - fare;
    const now = new Date().toISOString();
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user?.id || "usr_guest",
      cardId: activeCard.id,
      maskedCardNumber: activeCard.maskedCardNumber,
      type: "bus_fare",
      amount: -fare,
      currency: "RWF",
      status: "completed",
      description: "Bus Fare",
      route,
      busPlate: "RAD 458 B",
      busOperator: "Kigali Bus Services (KBS)",
      paymentMethod: "card_balance",
      timestamp: now,
      fee: 0,
      balanceAfter: newBal,
      receiptNumber: `TG-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setCards((prev) =>
      prev.map((c) => (c.id === activeCard.id ? { ...c, balance: newBal, lastUsedAt: now, lastUsedRoute: route } : c))
    );
    setTransactions((prev) => [tx, ...prev]);

    addNotification({
      type: "bus_fare",
      title: "Bus Payment",
      message: `${formatRWF(fare)} was deducted from your Tap & Go card for ${route}. Balance remaining: ${formatRWF(newBal)}.`,
      amount: fare,
      actionUrl: "/transactions",
    });

    if (newBal < 1000) {
      addNotification({
        type: "low_balance",
        title: "Low Balance Warning",
        message: `Your card balance is ${formatRWF(newBal)}. Top up now to avoid interruptions.`,
        actionUrl: "/top-up",
      });
    }
  };

  const updateUser = (profile: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...profile } : null));
  };

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  const resetToMockData = () => {
    setIsAuthenticated(true);
    setUser(MOCK_USER);
    setCards(MOCK_CARDS);
    setTransactions(MOCK_TRANSACTIONS);
    if (typeof window !== "undefined") {
      localStorage.setItem("tapgo_auth_logged_in", "true");
      localStorage.setItem("tapgo_user", JSON.stringify(MOCK_USER));
      localStorage.setItem("tapgo_cards", JSON.stringify(MOCK_CARDS));
      localStorage.setItem("tapgo_transactions", JSON.stringify(MOCK_TRANSACTIONS));
      localStorage.removeItem("tapgo_notifications");
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        cards,
        activeCard,
        transactions,
        isDemoMode,
        isLoading,
        login,
        logout,
        setActiveCard,
        topUpActiveCard,
        linkNewCard,
        toggleFreezeCard,
        updateUser,
        toggleDemoMode,
        simulateBusRideDeduction,
        resetToMockData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
