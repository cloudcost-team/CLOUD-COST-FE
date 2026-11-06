import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Notification = {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
};

type Callback = (response: { credential: string }) => void;

function installGoogle(notification?: Notification) {
  let callback: Callback | undefined;
  const initialize = vi.fn((options: { callback: Callback }) => {
    callback = options.callback;
  });
  const prompt = vi.fn((listener?: (n: Notification) => void) => {
    if (notification) listener?.(notification);
  });
  window.google = { accounts: { id: { initialize, prompt } } };
  return { respond: (credential: string) => callback?.({ credential }) };
}

async function loadModule() {
  vi.resetModules();
  return import("@/lib/googleIdentity");
}

describe("Google 인증 정보 요청", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    delete window.google;
  });

  it("로그인 창이 표시되지 않으면 기다리지 않고 안내 문구로 실패한다", async () => {
    installGoogle({ isNotDisplayed: () => true, isSkippedMoment: () => false });
    const { requestGoogleCredential, GoogleIdentityError } = await loadModule();

    const result = requestGoogleCredential("client-id");

    await expect(result).rejects.toThrow(
      "Google 로그인 창이 닫혔거나 표시되지 않았어요. 다시 시도해 주세요.",
    );
    await expect(result).rejects.toBeInstanceOf(GoogleIdentityError);
  });

  it("로그인 창이 건너뛰어지면 바로 실패한다", async () => {
    installGoogle({ isNotDisplayed: () => false, isSkippedMoment: () => true });
    const { requestGoogleCredential } = await loadModule();

    await expect(requestGoogleCredential("client-id")).rejects.toThrow(
      "Google 로그인 창이 닫혔거나 표시되지 않았어요. 다시 시도해 주세요.",
    );
  });

  it("Google이 인증 정보를 돌려주면 그 값으로 성공한다", async () => {
    const google = installGoogle({
      isNotDisplayed: () => false,
      isSkippedMoment: () => false,
    });
    const { requestGoogleCredential } = await loadModule();

    const result = requestGoogleCredential("client-id");
    await vi.advanceTimersByTimeAsync(0);
    google.respond("google-credential");

    await expect(result).resolves.toBe("google-credential");
  });

  it("응답이 없으면 60초 뒤 시간 초과로 실패한다", async () => {
    installGoogle({
      isNotDisplayed: () => false,
      isSkippedMoment: () => false,
    });
    const { requestGoogleCredential } = await loadModule();

    const result = requestGoogleCredential("client-id");
    const assertion = expect(result).rejects.toThrow(
      "Google 로그인 응답 시간이 초과되었습니다.",
    );
    await vi.advanceTimersByTimeAsync(59_999);
    await vi.advanceTimersByTimeAsync(1);

    await assertion;
  });
});
