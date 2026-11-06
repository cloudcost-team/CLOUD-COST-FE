import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DemoLoginScreen } from "@/components/layout/DemoLoginScreen";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
}));

const STORED_SETUP_KEY = ["demo", "stored-setup"];

function renderScreen() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <DemoLoginScreen />
    </QueryClientProvider>,
  );
  return queryClient;
}

function submit(username: string, password: string) {
  fireEvent.change(screen.getByLabelText("아이디"), {
    target: { value: username },
  });
  fireEvent.change(screen.getByLabelText("비밀번호"), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole("button", { name: "체험 시작" }));
}

describe("체험 로그인 화면", () => {
  beforeEach(() => {
    sessionStorage.clear();
    push.mockClear();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-06T03:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("올바르게 로그인하면 저장된 기본 구성이 캐시에도 반영된다", () => {
    const queryClient = renderScreen();
    queryClient.setQueryData(STORED_SETUP_KEY, { from: "old", to: "old" });

    submit("cloudcost", "1234");

    const stored = JSON.parse(
      sessionStorage.getItem("cloudcost.demoSetup") as string,
    );
    expect(stored.from).toBe("2026-08-08");
    expect(stored.to).toBe("2026-11-06");
    expect(queryClient.getQueryData(STORED_SETUP_KEY)).toEqual(stored);
    expect(push).toHaveBeenCalledWith("/demo/dashboard");
  });

  it("아이디나 비밀번호가 틀리면 안내하고 아무것도 바꾸지 않는다", () => {
    const queryClient = renderScreen();
    const previous = { from: "old", to: "old" };
    queryClient.setQueryData(STORED_SETUP_KEY, previous);

    submit("cloudcost", "wrong");

    expect(
      screen.getByText("아이디 또는 비밀번호가 맞지 않습니다."),
    ).toBeInTheDocument();
    expect(queryClient.getQueryData(STORED_SETUP_KEY)).toBe(previous);
    expect(sessionStorage.getItem("cloudcost.demoSetup")).toBeNull();
    expect(sessionStorage.getItem("cloudcost.demoAccount")).toBeNull();
    expect(push).not.toHaveBeenCalled();
  });
});
