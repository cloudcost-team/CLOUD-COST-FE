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
          <div className="max-md:hidden">
            <CurrencyToggle />
          </div>
          <NotificationBell />
          <UserMenu />
        </>
      }
      sidebar={<Sidebar />}
      menuFooter={<CurrencyToggle />}
      mainClassName="px-margin-screen pt-spacing-medium pb-spacing-xxlarge md:px-spacing-xlarge md:pt-spacing-large md:pb-spacing-xxxlarge"
    >
      {children}
    </AppShell>
  );
}
