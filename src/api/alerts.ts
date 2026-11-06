import type { AwsAccountStatus } from "./awsAccounts";
import type { BudgetCurrency } from "./budget";
import { apiRequest } from "./client";

export type AlertConditions = {
  budget80: boolean;
  budget100: boolean;
  budget120: boolean;
  spike: boolean;
  weeklySummary: boolean;
};

export type AlertSettings = AlertConditions & {
  channel: "IN_APP";
  budgets: {
    accountId: string;
    name: string;
    status: AwsAccountStatus;
    budget: { amount: number; currency: BudgetCurrency } | null;
  }[];
  notes: string[];
};

export type NotificationType = "BUDGET" | "SPIKE" | "WEEKLY_SUMMARY";

export type Notification = {
  id: string;
  type: NotificationType;
  typeLabel: string;
  accountId: string;
  accountName: string;
  message: string;
  createdAt: string;
  read: boolean;
  readAt: string | null;
};

export type NotificationPage = {
  items: Notification[];
  nextCursor: string | null;
  unreadCount: number;
  notes: string[];
};

export const alertKeys = {
  settings: ["alertSettings"] as const,
};

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (limit: number) => [...notificationKeys.all, "list", limit] as const,
  pages: () => [...notificationKeys.all, "pages"] as const,
  unreadCount: () => [...notificationKeys.all, "unreadCount"] as const,
};

export function getAlertSettings() {
  return apiRequest<AlertSettings>("/settings/alerts");
}

export function updateAlertConditions(conditions: AlertConditions) {
  return apiRequest<AlertSettings>("/settings/alerts", {
    method: "PUT",
    body: JSON.stringify(conditions),
  });
}

export function getNotifications(limit: number, cursor?: string | null) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  return apiRequest<NotificationPage>(`/notifications?${params}`);
}

export function getUnreadNotificationCount() {
  return apiRequest<{ unreadCount: number }>("/notifications/unread-count");
}

export function readAllNotifications() {
  return apiRequest<{ unreadCount: number }>("/notifications/read-all", {
    method: "POST",
  });
}

export function readNotification(notificationId: string) {
  return apiRequest<void>(`/notifications/${notificationId}/read`, {
    method: "POST",
  });
}
