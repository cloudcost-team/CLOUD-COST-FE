import type { Metadata } from "next";
import { WasteScreen } from "@/components/savings/WasteScreen";

export const metadata: Metadata = { title: "낭비 리소스" };

export default function WastePage() {
  return <WasteScreen />;
}
