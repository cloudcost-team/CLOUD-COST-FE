import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DemoSetupScreen } from "@/components/layout/DemoSetupScreen";

const push = vi.fn();
const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace }),
}));

vi.mock("@/api/demo", () => ({
  getDemoCatalog: vi.fn().mockResolvedValue({
    maxServers: 20,
    maxCountPerServer: 10,
    instanceTypes: [{ instanceType: "t3.micro" }],
    schedules: [{ code: "ALWAYS", label: "24시간" }],
  }),
}));

const STORED_SETUP_KEY = ["demo", "stored-setup"];

function renderScreen() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <DemoSetupScreen />
    </QueryClientProvider>,
  );
  return queryClient;
}

describe("체험 설정 화면", () => {
  beforeEach(() => {
    sessionStorage.clear();
    push.mockClear();
    replace.mockClear();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-06T03:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("체험 계정 정보가 없으면 체험 로그인으로 보낸다", () => {
    renderScreen();

    expect(replace).toHaveBeenCalledWith("/demo/login");
  });

  it("구성을 제출하면 이전 캐시가 제출한 구성으로 바뀌고 대시보드로 이동한다", async () => {
    sessionStorage.setItem(
      "cloudcost.demoAccount",
      JSON.stringify({ mode: "demo", username: "cloudcost" }),
    );
    const queryClient = renderScreen();
    queryClient.setQueryData(STORED_SETUP_KEY, { from: "old", to: "old" });

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "예시 비용 보기" }),
      ).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole("button", { name: "예시 비용 보기" }));

    const stored = JSON.parse(
      sessionStorage.getItem("cloudcost.demoSetup") as string,
    );
    expect(stored.to).toBe("2026-11-06");
    expect(stored.servers).toHaveLength(3);
    expect(queryClient.getQueryData(STORED_SETUP_KEY)).toEqual(stored);
    expect(push).toHaveBeenCalledWith("/demo/dashboard");
    expect(replace).not.toHaveBeenCalled();
  });
});
