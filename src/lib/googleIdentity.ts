type GoogleCredentialResponse = {
  credential: string;
};

type GoogleButtonOptions = {
  type: "standard";
  theme: "outline";
  size: "large";
  text: "continue_with";
  shape: "rectangular";
  logo_alignment: "center";
  locale: string;
  width: number;
};

type GoogleIdentity = {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  renderButton: (parent: HTMLElement, options: GoogleButtonOptions) => void;
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
let handleCredential: ((credential: string) => void) | undefined;

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

const GOOGLE_BUTTON_MIN_WIDTH = 200;
const GOOGLE_BUTTON_MAX_WIDTH = 400;

export async function renderGoogleButton(
  parent: HTMLElement,
  clientId: string,
  onCredential: (credential: string) => void,
) {
  await loadGoogleIdentity();

  const identity = window.google?.accounts.id;
  if (!identity) {
    throw new GoogleIdentityError("Google 로그인을 시작하지 못했습니다.");
  }

  handleCredential = onCredential;
  if (initializedClientId !== clientId) {
    identity.initialize({
      client_id: clientId,
      callback: (response) => handleCredential?.(response.credential),
    });
    initializedClientId = clientId;
  }

  identity.renderButton(parent, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "rectangular",
    logo_alignment: "center",
    locale: "ko",
    width: Math.min(
      Math.max(parent.clientWidth, GOOGLE_BUTTON_MIN_WIDTH),
      GOOGLE_BUTTON_MAX_WIDTH,
    ),
  });
}

export type GoogleProfile = {
  email: string;
  picture: string;
};

export function readGoogleProfile(idToken: string): GoogleProfile | null {
  try {
    const payload = idToken.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    const claims: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof claims !== "object" || claims === null) return null;
    const { email, picture } = claims as Record<string, unknown>;
    if (typeof email !== "string" || typeof picture !== "string") return null;
    return { email, picture };
  } catch {
    return null;
  }
}
