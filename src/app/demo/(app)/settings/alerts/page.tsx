import type { Metadata } from "next";
import { AlertSettingsScreen } from "@/components/alert/AlertSettingsScreen";

export const metadata: Metadata = { title: "체험 알림 설정" };

export default function DemoAlertSettingsPage() {
  return <AlertSettingsScreen />;
}
