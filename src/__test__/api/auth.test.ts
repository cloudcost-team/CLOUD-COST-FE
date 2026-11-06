import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAuthConfig, loginWithGoogle } from "@/api/auth";

const TEST_API_BASE_URL = "https://api.cloudcost.test/api/v1";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", TEST_API_BASE_URL);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("인증 API", () => {
  it("로그인 설정을 조회한다", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ authMode: "google", googleClientId: "client-id" }),
          { status: 200 },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(getAuthConfig()).resolves.toEqual({
      authMode: "google",
      googleClientId: "client-id",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      `${TEST_API_BASE_URL}/auth/config`,
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("Google credential을 idToken 필드로 전달한다", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          accessToken: "token",
          tokenType: "Bearer",
          expiresAt: "2026-11-06T01:00:00Z",
          newUser: false,
          user: {},
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await loginWithGoogle({ idToken: "google-credential" });

    expect(fetchMock).toHaveBeenCalledWith(
      `${TEST_API_BASE_URL}/auth/google`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ idToken: "google-credential" }),
      }),
    );
  });
});
