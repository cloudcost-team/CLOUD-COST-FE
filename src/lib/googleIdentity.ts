type GoogleCodeResponse = {
  code?: string;
  error?: string;
};

type GoogleCodeClientError = {
  type: "popup_failed_to_open" | "popup_closed" | "unknown";
};

export type GoogleCodeClient = {
  requestCode: () => void;
};

type GoogleOAuth2 = {
  initCodeClient: (options: {
    client_id: string;
    scope: string;
    ux_mode: "popup";
    callback: (response: GoogleCodeResponse) => void;
    error_callback: (error: GoogleCodeClientError) => void;
  }) => GoogleCodeClient;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: GoogleOAuth2;
      };
    };
  }
}

export class GoogleIdentityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoogleIdentityError";
  }
}

const SCRIPT_SELECTOR = 'script[data-cloudcost-google-identity="true"]';

let scriptPromise: Promise<void> | undefined;

function loadGoogleIdentity() {
  if (window.google?.accounts.oauth2) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(SCRIPT_SELECTOR);

    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => {
        script.remove();
        scriptPromise = undefined;
        reject(
          new GoogleIdentityError("Google 로그인 모듈을 불러오지 못했습니다."),
        );
      },
      { once: true },
    );

    if (!existing) {
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.dataset.cloudcostGoogleIdentity = "true";
      document.head.append(script);
    }
  });

  return scriptPromise;
}

export async function createGoogleCodeClient(
  clientId: string,
  onCode: (code: string) => void,
  onError: (message: string) => void,
) {
  await loadGoogleIdentity();

  const oauth2 = window.google?.accounts.oauth2;
  if (!oauth2) {
    throw new GoogleIdentityError("Google 로그인을 시작하지 못했습니다.");
  }

  return oauth2.initCodeClient({
    client_id: clientId,
    scope: "openid email profile",
    ux_mode: "popup",
    callback: (response) => {
      if (response.code) onCode(response.code);
      else onError("Google 로그인을 마치지 못했습니다. 다시 시도해 주세요.");
    },
    error_callback: (error) => {
      if (error.type === "popup_closed") return;
      onError(
        error.type === "popup_failed_to_open"
          ? "Google 로그인 창을 열지 못했습니다. 브라우저의 팝업 차단을 해제해 주세요."
          : "Google 로그인을 시작하지 못했습니다.",
      );
    },
  });
}
