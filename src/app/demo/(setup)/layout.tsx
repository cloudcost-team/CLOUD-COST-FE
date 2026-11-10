import type { ReactNode } from "react";
import { DemoShell } from "@/components/demo/DemoShell";

export default function DemoSetupLayout({ children }: { children: ReactNode }) {
  return <DemoShell variant="setup">{children}</DemoShell>;
}
