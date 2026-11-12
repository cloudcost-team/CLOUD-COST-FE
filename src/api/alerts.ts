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

export type AlertChannelType = "DISCORD";

export type AlertChannel = {
  channelId: string;
  type: AlertChannelType;
  typeLabel: string;
  target: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AlertChannelList = {
  items: AlertChannel[];
  maxChannels: number;
  notes: string[];
};

export type CreateAlertChannelRequest = {
  type: AlertChannelType;
  webhookUrl: string;
  enabled?: boolean;
};

export type UpdateAlertChannelRequest = {
  webhookUrl?: string;
  enabled: boolean;
};

export type AlertChannelTestResult = {
  ok: boolean;
  reason: string | null;
};

export type NotificationType = "BUDGET" | "SPIKE" | "WEEKLY_SUMMARY";

export type DeliveryStatus = "PENDING" | "SENT" | "FAILED";

export type NotificationDelivery = {
  channelId: string;
  channelType: AlertChannelType;
  target: string;
  status: DeliveryStatus;
  statusLabel: string;
  attempts: number;
  lastError: string | null;
  sentAt: string | null;
};

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
  deliveries: NotificationDelivery[];
};

export type NotificationPage = {
  items: Notification[];
  nextCursor: string | null;
  unreadCount: number;
  notes: string[];
};

export const alertKeys = {
  settings: ["alertSettings"] as const,
  channels: ["alertChannels"] as const,
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

export function getAlertChannels() {
  return apiRequest<AlertChannelList>("/settings/alerts/channels");
}

export function createAlertChannel(request: CreateAlertChannelRequest) {
  return apiRequest<AlertChannel>("/settings/alerts/channels", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function updateAlertChannel(
  channelId: string,
  request: UpdateAlertChannelRequest,
) {
  return apiRequest<AlertChannel>(`/settings/alerts/channels/${channelId}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export function deleteAlertChannel(channelId: string) {
  return apiRequest<void>(`/settings/alerts/channels/${channelId}`, {
    method: "DELETE",
  });
}

export function testAlertChannel(channelId: string) {
  return apiRequest<AlertChannelTestResult>(
    `/settings/alerts/channels/${channelId}/test`,
    { method: "POST" },
  );
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
