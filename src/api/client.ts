import { getLoginSession } from "@/lib/authSession";

type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
  };
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

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const accessToken = getLoginSession()?.accessToken;
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...init?.headers,
    },
  });

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
