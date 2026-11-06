import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return <AppShell type="demo">{children}</AppShell>;
}
