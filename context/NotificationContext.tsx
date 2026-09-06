"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AppNotification } from "@/types/notification";
import { MOCK_NOTIFICATIONS } from "@/data/mock-data";

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  resetNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (typeof window !== "undefined") {
      const authFlag = localStorage.getItem("tapgo_auth_logged_in");
      if (authFlag === "false") {
        return [];
      }
      const saved = localStorage.getItem("tapgo_notifications");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return MOCK_NOTIFICATIONS;
        }
      }
    }
    return MOCK_NOTIFICATIONS;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authFlag = localStorage.getItem("tapgo_auth_logged_in");
      if (authFlag !== "false") {
        localStorage.setItem("tapgo_notifications", JSON.stringify(notifications));
      }
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (notif: Omit<AppNotification, "id" | "timestamp" | "read">) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("tapgo_notifications");
    }
  };

  const resetNotifications = () => {
    setNotifications(MOCK_NOTIFICATIONS);
    if (typeof window !== "undefined") {
      localStorage.setItem("tapgo_notifications", JSON.stringify(MOCK_NOTIFICATIONS));
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        resetNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
