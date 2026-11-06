import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ConnectionSelector } from "@/components/layout/ConnectionSelector";
import { CurrencyToggle } from "@/components/layout/CurrencyToggle";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { Sidebar } from "@/components/layout/Sidebar";
import { UserMenu } from "@/components/layout/UserMenu";

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      headerEnd={
        <>
          <ConnectionSelector />
          <CurrencyToggle />
          <NotificationBell />
          <UserMenu />
        </>
      }
      sidebar={<Sidebar />}
      mainClassName="px-spacing-xlarge pt-spacing-large pb-spacing-xxxlarge"
    >
      {children}
    </AppShell>
  );
}
