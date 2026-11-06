type LoginSession = {
  accessToken: string;
  tokenType: "Bearer";
  expiresAt: string;
  newUser: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    provider: string;
    createdAt: string;
    lastLoginAt: string;
  };
};

const SESSION_KEY = "cloudcost.session";

export function saveLoginSession(session: LoginSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getLoginSession(): LoginSession | null {
  const rawSession = sessionStorage.getItem(SESSION_KEY);
  if (!rawSession) return null;

  try {
    const session = JSON.parse(rawSession) as Partial<LoginSession>;
    const expiresAt = session.expiresAt
      ? Date.parse(session.expiresAt)
      : Number.NaN;

    if (!session.accessToken || !Number.isFinite(expiresAt)) return null;
    if (expiresAt <= Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session as LoginSession;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function hasValidLoginSession() {
  return getLoginSession() !== null;
}

export function clearLoginSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

const RETURN_PATH_KEY = "cloudcost.returnPath";

export function saveReturnPath(path: string) {
  sessionStorage.setItem(RETURN_PATH_KEY, path);
}

export function takeReturnPath() {
  const path = sessionStorage.getItem(RETURN_PATH_KEY);
  sessionStorage.removeItem(RETURN_PATH_KEY);
  return path?.startsWith("/") && !path.startsWith("//") ? path : null;
}
