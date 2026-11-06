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

export function hasValidLoginSession() {
  const rawSession = sessionStorage.getItem(SESSION_KEY);
  if (!rawSession) return false;

  try {
    const session = JSON.parse(rawSession) as Partial<LoginSession>;
    const expiresAt = session.expiresAt
      ? Date.parse(session.expiresAt)
      : Number.NaN;

    if (!session.accessToken || !Number.isFinite(expiresAt)) return false;
    if (expiresAt <= Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }

    return true;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return false;
  }
}
