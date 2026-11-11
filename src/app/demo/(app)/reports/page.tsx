import type { Metadata } from "next";
import { ReportListScreen } from "@/components/report/ReportListScreen";

export const metadata: Metadata = { title: "체험 월간 리포트" };

export default function DemoReportsPage() {
  return <ReportListScreen />;
}
