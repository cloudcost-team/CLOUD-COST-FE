"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { DemoCurrency } from "@/api/demo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { AppShell } from "@/components/layout/AppShell";

type DemoShellContextValue = {
  currency: DemoCurrency;
};

const DemoShellContext = createContext<DemoShellContextValue | null>(null);

export function useDemoShell() {
  const context = useContext(DemoShellContext);
  if (!context)
    throw new Error("useDemoShell은 DemoShell 내부에서 사용해야 합니다.");
  return context;
}

export function DemoShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currency, setCurrency] = useState<DemoCurrency>("KRW");
  const isDemoDashboard = pathname === "/demo/dashboard";

  function exitDemo() {
    sessionStorage.removeItem("cloudcost.demoAccount");
    sessionStorage.removeItem("cloudcost.demoSetup");
    router.push("/login");
  }

  if (pathname === "/demo/login")
    return (
      <DemoShellContext value={{ currency }}>
        <div className="min-h-screen bg-background-lower">{children}</div>
      </DemoShellContext>
    );

  return (
    <DemoShellContext value={{ currency }}>
      <AppShell
        logoHref="/login"
        headerStart={<Badge>체험 데이터</Badge>}
        headerEnd={
          isDemoDashboard ? (
            <>
              <SegmentedControl
                options={[
                  { value: "KRW", label: "원" },
                  { value: "USD", label: "달러" },
                ]}
                value={currency}
                onChange={setCurrency}
                aria-label="통화"
              />
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
          ) : (
            <Button variant="assistive" size="small" onClick={exitDemo}>
              체험 종료
            </Button>
          )
        }
        mainClassName="mx-auto max-w-[1440px] px-6 py-10 md:px-20 xl:px-30"
      >
        {children}
      </AppShell>
    </DemoShellContext>
  );
}
