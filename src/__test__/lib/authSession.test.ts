import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hasValidLoginSession, saveLoginSession } from "@/lib/authSession";

const session: Parameters<typeof saveLoginSession>[0] = {
  accessToken: "access-token",
  tokenType: "Bearer",
  expiresAt: "2026-11-06T02:00:00.000Z",
  newUser: false,
  user: {
    id: "user-id",
    email: "user@example.com",
    name: "사용자",
    provider: "google",
    createdAt: "2026-11-06T00:00:00.000Z",
    lastLoginAt: "2026-11-06T01:00:00.000Z",
  },
};

describe("인증 세션", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-06T01:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("만료되지 않은 세션을 저장하고 확인한다", () => {
    saveLoginSession(session);

    expect(hasValidLoginSession()).toBe(true);
  });

  it("만료된 세션을 제거한다", () => {
    saveLoginSession({ ...session, expiresAt: "2026-11-06T00:59:59.000Z" });

    expect(hasValidLoginSession()).toBe(false);
    expect(sessionStorage.getItem("cloudcost.session")).toBeNull();
  });

  it("손상된 세션을 제거한다", () => {
    sessionStorage.setItem("cloudcost.session", "not-json");

    expect(hasValidLoginSession()).toBe(false);
    expect(sessionStorage.getItem("cloudcost.session")).toBeNull();
  });
});
