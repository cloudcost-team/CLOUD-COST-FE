import type { Metadata } from "next";
import { WasteScreen } from "@/components/savings/WasteScreen";

export const metadata: Metadata = { title: "체험 낭비 리소스" };

export default function DemoWastePage() {
  return <WasteScreen />;
}
