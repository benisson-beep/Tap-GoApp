export type NotificationType = 'top_up' | 'bus_fare' | 'low_balance' | 'security' | 'card_linked';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  amount?: number;
  read: boolean;
  timestamp: string; // ISO string
  actionUrl?: string;
}
