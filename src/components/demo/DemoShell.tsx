"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { CurrencyToggle } from "@/components/layout/CurrencyToggle";
import { Sidebar } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AppModeContext, DEMO_APP_MODE } from "@/hooks/useAppMode";

type DemoShellProps = {
  variant: "setup" | "app";
  children: ReactNode;
};

export function DemoShell({ variant, children }: DemoShellProps) {
  const router = useRouter();

  function exitDemo() {
    sessionStorage.removeItem("cloudcost.demoAccount");
    sessionStorage.removeItem("cloudcost.demoSetup");
    router.push("/login");
  }

  if (variant === "setup")
    return (
      <AppShell
        logoHref="/login"
        headerStart={<Badge>체험 데이터</Badge>}
        headerEnd={
          <Button variant="assistive" size="small" onClick={exitDemo}>
            체험 종료
          </Button>
        }
        mainClassName="mx-auto max-w-[1440px] px-6 py-10 md:px-20 xl:px-30"
      >
        {children}
      </AppShell>
    );

  return (
    <AppModeContext value={DEMO_APP_MODE}>
      <AppShell
        logoHref="/login"
        headerStart={<Badge>체험 데이터</Badge>}
        headerEnd={
          <>
            <CurrencyToggle />
            <Button
              variant="secondary"
              size="small"
              onClick={() => router.push("/demo/setup")}
            >
              구성 다시 하기
            </Button>
            <Button size="small" onClick={() => router.push("/login")}>
              내 AWS 연결하기
            </Button>
          </>
        }
        sidebar={<Sidebar />}
        mainClassName="px-spacing-xlarge pt-spacing-large pb-spacing-xxxlarge"
      >
        {children}
      </AppShell>
    </AppModeContext>
  );
}
