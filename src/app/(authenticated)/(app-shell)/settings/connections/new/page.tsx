import type { Metadata } from "next";
import { NewConnectionScreen } from "@/components/connection/NewConnectionScreen";

export const metadata: Metadata = { title: "새 AWS 연결" };

export default function NewConnectionPage() {
  return <NewConnectionScreen />;
}
