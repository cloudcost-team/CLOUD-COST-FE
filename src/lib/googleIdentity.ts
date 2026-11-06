type GoogleCredentialResponse = {
  credential: string;
};

type GooglePromptNotification = {
  isSkippedMoment: () => boolean;
};

type GoogleIdentity = {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  prompt: (listener?: (notification: GooglePromptNotification) => void) => void;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleIdentity;
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
let initializedClientId: string | undefined;
let settleCredential: ((credential: string) => void) | undefined;

function loadGoogleIdentity() {
  if (window.google?.accounts.id) return Promise.resolve();
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

export async function requestGoogleCredential(clientId: string) {
  await loadGoogleIdentity();

  const identity = window.google?.accounts.id;
  if (!identity) {
    throw new GoogleIdentityError("Google 로그인을 시작하지 못했습니다.");
  }

  if (initializedClientId !== clientId) {
    identity.initialize({
      client_id: clientId,
      callback: (response) => settleCredential?.(response.credential),
    });
    initializedClientId = clientId;
  }

  return new Promise<string>((resolve, reject) => {
    const timeout = window.setTimeout(
      () =>
        finish(() =>
          reject(
            new GoogleIdentityError(
              "Google 로그인 응답 시간이 초과되었습니다.",
            ),
          ),
        ),
      60_000,
    );

    function finish(settle: () => void) {
      window.clearTimeout(timeout);
      settleCredential = undefined;
      settle();
    }

    settleCredential = (credential) => finish(() => resolve(credential));

    identity.prompt((notification) => {
      if (notification.isSkippedMoment()) {
        finish(() =>
          reject(
            new GoogleIdentityError(
              "Google 로그인 창이 닫혔거나 표시되지 않았어요. 다시 시도해 주세요.",
            ),
          ),
        );
      }
    });
  });
}
