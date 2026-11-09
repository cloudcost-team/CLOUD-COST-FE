import type { Metadata } from "next";
import { DemoLoginScreen } from "@/components/demo/DemoLoginScreen";

export const metadata: Metadata = { title: "체험 로그인" };

export default function DemoLoginPage() {
  return <DemoLoginScreen />;
}
