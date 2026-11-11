import { afterEach, describe, expect, it, vi } from "vitest";

type CodeClientOptions = {
  client_id: string;
  scope: string;
  ux_mode: string;
  callback: (response: { code?: string; error?: string }) => void;
  error_callback: (error: {
    type: "popup_failed_to_open" | "popup_closed" | "unknown";
  }) => void;
};

function installGoogle() {
  let options: CodeClientOptions | undefined;
  const requestCode = vi.fn();
  const initCodeClient = vi.fn((received: CodeClientOptions) => {
    options = received;
    return { requestCode };
  });
  window.google = { accounts: { oauth2: { initCodeClient } } };
  return {
    initCodeClient,
    requestCode,
    respond: (response: { code?: string; error?: string }) =>
      options?.callback(response),
    fail: (type: "popup_failed_to_open" | "popup_closed" | "unknown") =>
      options?.error_callback({ type }),
  };
}

async function loadModule() {
  vi.resetModules();
  return import("@/lib/googleIdentity");
}

describe("Google 팝업 로그인", () => {
  afterEach(() => {
    delete window.google;
  });

  it("로그인 정보만 요청하는 팝업 방식으로 준비한다", async () => {
    const google = installGoogle();
    const { createGoogleCodeClient } = await loadModule();

    await createGoogleCodeClient("client-id", vi.fn(), vi.fn());

    expect(google.initCodeClient).toHaveBeenCalledWith(
      expect.objectContaining({
        client_id: "client-id",
        scope: "openid email profile",
        ux_mode: "popup",
      }),
    );
  });

  it("버튼을 누르면 Google 팝업을 연다", async () => {
    const google = installGoogle();
    const { createGoogleCodeClient } = await loadModule();

    const client = await createGoogleCodeClient("client-id", vi.fn(), vi.fn());
    client.requestCode();

    expect(google.requestCode).toHaveBeenCalledTimes(1);
  });

  it("Google이 준 인가 코드를 넘긴다", async () => {
    const google = installGoogle();
    const { createGoogleCodeClient } = await loadModule();
    const onCode = vi.fn();
    const onError = vi.fn();

    await createGoogleCodeClient("client-id", onCode, onError);
    google.respond({ code: "auth-code" });

    expect(onCode).toHaveBeenCalledWith("auth-code");
    expect(onError).not.toHaveBeenCalled();
  });

  it("사용자가 동의하지 않으면 다시 시도하라고 알린다", async () => {
    const google = installGoogle();
    const { createGoogleCodeClient } = await loadModule();
    const onCode = vi.fn();
    const onError = vi.fn();

    await createGoogleCodeClient("client-id", onCode, onError);
    google.respond({ error: "access_denied" });

    expect(onCode).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      "Google 로그인을 마치지 못했습니다. 다시 시도해 주세요.",
    );
  });

  it("팝업이 차단되면 팝업 차단을 풀라고 알린다", async () => {
    const google = installGoogle();
    const { createGoogleCodeClient } = await loadModule();
    const onError = vi.fn();

    await createGoogleCodeClient("client-id", vi.fn(), onError);
    google.fail("popup_failed_to_open");

    expect(onError).toHaveBeenCalledWith(
      "Google 로그인 창을 열지 못했습니다. 브라우저의 팝업 차단을 해제해 주세요.",
    );
  });

  it("사용자가 팝업을 닫으면 오류로 보지 않는다", async () => {
    const google = installGoogle();
    const { createGoogleCodeClient } = await loadModule();
    const onError = vi.fn();

    await createGoogleCodeClient("client-id", vi.fn(), onError);
    google.fail("popup_closed");

    expect(onError).not.toHaveBeenCalled();
  });
});
