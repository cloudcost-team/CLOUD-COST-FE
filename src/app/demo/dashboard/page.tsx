import type { Metadata } from "next";
import { DemoDashboardScreen } from "@/components/demo/DemoDashboardScreen";

export const metadata: Metadata = { title: "체험 대시보드" };

export default function DemoDashboardPage() {
  return <DemoDashboardScreen />;
}
