import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/authSession";

type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
  };
};

type RefreshResponse = {
  accessToken: string;
  tokenType: "Bearer";
  expiresAt: string;
};

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL 환경변수가 설정되지 않았습니다.");
  }

  return apiBaseUrl;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const PUBLIC_PATH_PREFIXES = ["/auth/", "/demo/"];

let refreshing: Promise<boolean> | null = null;

async function requestRefresh() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      clearAccessToken();
      return false;
    }
    const body = (await response.json()) as RefreshResponse;
    setAccessToken(body.accessToken);
    return true;
  } catch {
    return false;
  }
}

export function refreshAccessToken() {
  refreshing ??= requestRefresh().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

function send(path: string, init?: RequestInit) {
  const accessToken = getAccessToken();
  return fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...init?.headers,
    },
  });
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const needsLogin = !PUBLIC_PATH_PREFIXES.some((prefix) =>
    path.startsWith(prefix),
  );
  const refreshedBeforeSend = needsLogin && !getAccessToken();
  if (refreshedBeforeSend) await refreshAccessToken();

  let response = await send(path, init);
  if (
    response.status === 401 &&
    needsLogin &&
    !refreshedBeforeSend &&
    (await refreshAccessToken())
  ) {
    response = await send(path, init);
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new ApiError(
      body.error?.message ?? "요청을 처리하지 못했습니다.",
      response.status,
      body.error?.code,
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
