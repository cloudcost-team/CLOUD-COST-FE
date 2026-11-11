import type { ReactNode } from "react";
import { DemoShell } from "@/components/demo/DemoShell";

export default function DemoAppLayout({ children }: { children: ReactNode }) {
  return <DemoShell variant="app">{children}</DemoShell>;
}
