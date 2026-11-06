"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { DemoCurrency } from "@/api/demo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

export type AppShellType = "demo" | "app";

type AppShellContextValue = {
  currency: DemoCurrency;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context)
    throw new Error("useAppShell은 AppShell 내부에서 사용해야 합니다.");
  return context;
}

type AppShellProps = {
  type: AppShellType;
  children: ReactNode;
};

export function AppShell({ type, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currency, setCurrency] = useState<DemoCurrency>("KRW");
  const isDemo = type === "demo";
  const isDemoLogin = isDemo && pathname === "/demo/login";
  const isDemoDashboard = isDemo && pathname === "/demo/dashboard";

  function exitDemo() {
    sessionStorage.removeItem("cloudcost.demoAccount");
    sessionStorage.removeItem("cloudcost.demoSetup");
    router.push("/login");
  }

  if (isDemoLogin)
    return (
      <AppShellContext value={{ currency }}>
        <div className="min-h-screen bg-background-lower">{children}</div>
      </AppShellContext>
    );

  return (
    <AppShellContext value={{ currency }}>
      <div className="min-h-screen bg-background-lower">
        <header className="flex h-16 items-center border-b border-border-default bg-background-default px-6 md:px-10">
          <Link href="/login" aria-label="CloudCost 로그인으로 이동">
            <Logo />
          </Link>
          {isDemo && <Badge className="ml-3">체험 데이터</Badge>}
          <div className="ml-auto flex items-center gap-2">
            {isDemoDashboard && (
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
            )}
            {isDemo && !isDemoDashboard && (
              <Button variant="assistive" size="small" onClick={exitDemo}>
                체험 종료
              </Button>
            )}
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-6 py-10 md:px-20 xl:px-30">
          {children}
        </main>
      </div>
    </AppShellContext>
  );
}
