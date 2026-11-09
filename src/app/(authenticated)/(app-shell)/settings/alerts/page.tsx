import type { Metadata } from "next";
import { AlertSettingsScreen } from "@/components/alert/AlertSettingsScreen";

export const metadata: Metadata = { title: "알림 설정" };

export default function AlertSettingsPage() {
  return <AlertSettingsScreen />;
}
