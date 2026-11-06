import { apiRequest } from "./client";

type AuthConfig = {
  authMode: "dev" | "google";
  googleClientId: string;
};

type GoogleLoginRequest = {
  idToken: string;
};

type AuthUser = {
  id: string;
  email: string;
  name: string;
  provider: string;
  createdAt: string;
  lastLoginAt: string;
};

type LoginSession = {
  accessToken: string;
  tokenType: "Bearer";
  expiresAt: string;
  newUser: boolean;
  user: AuthUser;
};

export function getAuthConfig() {
  return apiRequest<AuthConfig>("/auth/config");
}

export function loginWithGoogle(input: GoogleLoginRequest) {
  return apiRequest<LoginSession>("/auth/google", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
