import { afterEach, describe, expect, it, vi } from "vitest";

type Callback = (response: { credential: string }) => void;

function installGoogle() {
  let callback: Callback | undefined;
  const initialize = vi.fn((options: { callback: Callback }) => {
    callback = options.callback;
  });
  const renderButton = vi.fn();
  window.google = { accounts: { id: { initialize, renderButton } } };
  return {
    initialize,
    renderButton,
    respond: (credential: string) => callback?.({ credential }),
  };
}

function createContainer(width: number) {
  const container = document.createElement("div");
  Object.defineProperty(container, "clientWidth", { value: width });
  return container;
}

async function loadModule() {
  vi.resetModules();
  return import("@/lib/googleIdentity");
}

describe("Google 공식 로그인 버튼", () => {
  afterEach(() => {
    delete window.google;
  });

  it("넘겨받은 영역에 한국어 Google 버튼을 그린다", async () => {
    const google = installGoogle();
    const { renderGoogleButton } = await loadModule();
    const container = createContainer(300);

    await renderGoogleButton(container, "client-id", vi.fn());

    expect(google.renderButton).toHaveBeenCalledWith(
      container,
      expect.objectContaining({ locale: "ko", width: 300 }),
    );
  });

  it("버튼 너비는 Google이 허용하는 200~400px 안으로 맞춘다", async () => {
    const google = installGoogle();
    const { renderGoogleButton } = await loadModule();

    await renderGoogleButton(createContainer(120), "client-id", vi.fn());
    await renderGoogleButton(createContainer(640), "client-id", vi.fn());

    expect(google.renderButton.mock.calls[0][1].width).toBe(200);
    expect(google.renderButton.mock.calls[1][1].width).toBe(400);
  });

  it("Google이 돌려준 인증 정보를 마지막으로 그린 버튼의 콜백에 넘긴다", async () => {
    const google = installGoogle();
    const { renderGoogleButton } = await loadModule();
    const first = vi.fn();
    const second = vi.fn();

    await renderGoogleButton(createContainer(300), "client-id", first);
    await renderGoogleButton(createContainer(300), "client-id", second);
    google.respond("google-credential");

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith("google-credential");
  });

  it("같은 클라이언트 ID로 다시 그려도 초기화는 한 번만 한다", async () => {
    const google = installGoogle();
    const { renderGoogleButton } = await loadModule();

    await renderGoogleButton(createContainer(300), "client-id", vi.fn());
    await renderGoogleButton(createContainer(300), "client-id", vi.fn());

    expect(google.initialize).toHaveBeenCalledTimes(1);
  });
});
