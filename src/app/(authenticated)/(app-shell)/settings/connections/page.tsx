import type { Metadata } from "next";
import { ConnectionListScreen } from "@/components/connection/ConnectionListScreen";

export const metadata: Metadata = { title: "데이터 연결" };

export default function ConnectionsPage() {
  return <ConnectionListScreen />;
}
