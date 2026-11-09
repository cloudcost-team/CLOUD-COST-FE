import type { Metadata } from "next";
import { NotificationListScreen } from "@/components/notification/NotificationListScreen";

export const metadata: Metadata = { title: "알림" };

export default function NotificationsPage() {
  return <NotificationListScreen />;
}
