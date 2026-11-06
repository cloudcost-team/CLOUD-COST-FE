import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AppHeader } from "./AppHeader";

type AppShellProps = {
  logoHref?: string;
  headerStart?: ReactNode;
  headerEnd?: ReactNode;
  sidebar?: ReactNode;
  mainClassName?: string;
  children: ReactNode;
};

export function AppShell({
  logoHref,
  headerStart,
  headerEnd,
  sidebar,
  mainClassName,
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background-lower">
      <AppHeader logoHref={logoHref} start={headerStart} end={headerEnd} />
      <div className="flex flex-1">
        {sidebar}
        <main className={cn("w-full min-w-0 flex-1", mainClassName)}>
          {children}
        </main>
      </div>
    </div>
  );
}
