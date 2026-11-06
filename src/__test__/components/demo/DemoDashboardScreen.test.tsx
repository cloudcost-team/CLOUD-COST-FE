import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { DemoSetupRequest } from "@/api/demo";
import { DemoDashboardScreen } from "@/components/demo/DemoDashboardScreen";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/components/demo/DemoShell", () => ({
  useDemoShell: () => ({ currency: "KRW" }),
}));

vi.mock("@/api/demo", () => ({
  getDemoCosts: vi.fn().mockRejectedValue(new Error("offline")),
  getDemoDailyCosts: vi.fn().mockRejectedValue(new Error("offline")),
}));

function storeSetup(setup: DemoSetupRequest) {
  sessionStorage.setItem("cloudcost.demoSetup", JSON.stringify(setup));
}

function renderScreen() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <DemoDashboardScreen />
    </QueryClientProvider>,
  );
}

describe("체험 대시보드 화면", () => {
  beforeAll(() => {
    process.env.TZ = "Asia/Seoul";
  });

  beforeEach(() => {
    sessionStorage.clear();
  });

  it("일별 비용이 조회 시작일부터 표시된다", async () => {
    storeSetup({
      from: "2026-11-06",
      to: "2026-11-08",
      servers: [
        {
          name: "web",
          instanceType: "t3.micro",
          os: "LINUX",
          count: 1,
          schedule: "ALWAYS",
        },
      ],
    });
    renderScreen();

    const first = await screen.findByTitle(/^2026-11-06:/);

    expect(first).toBeInTheDocument();
    expect(screen.queryByTitle(/^2026-11-05:/)).not.toBeInTheDocument();
    expect(screen.getByTitle(/^2026-11-08:/)).toBeInTheDocument();
  });

  it("평일 근무 일정은 토요일과 일요일로 표시된 날짜의 비용이 0이다", async () => {
    storeSetup({
      from: "2026-11-06",
      to: "2026-11-09",
      servers: [
        {
          name: "batch",
          instanceType: "t3.micro",
          os: "LINUX",
          count: 1,
          schedule: "WEEKDAY_OFFICE",
        },
      ],
    });
    renderScreen();

    expect(await screen.findByTitle("2026-11-07: ₩ 0")).toBeInTheDocument();
    expect(screen.getByTitle("2026-11-08: ₩ 0")).toBeInTheDocument();
    expect(screen.getByTitle("2026-11-06: ₩ 182")).toBeInTheDocument();
    expect(screen.getByTitle("2026-11-09: ₩ 182")).toBeInTheDocument();
  });
});
