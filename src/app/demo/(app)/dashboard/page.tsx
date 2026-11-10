import type { Metadata } from "next";
import { DashboardScreen } from "@/components/dashboard/DashboardScreen";

export const metadata: Metadata = { title: "체험 대시보드" };

export default function DemoDashboardPage() {
  return <DashboardScreen />;
}
