import { apiRequest } from "./client";
import type { Currency } from "./costs";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: (accountId: string, currency: Currency) =>
    [...dashboardKeys.all, "summary", accountId, currency] as const,
  instances: (accountId: string, currency: Currency) =>
    [...dashboardKeys.all, "instances", accountId, currency] as const,
};

export function getDashboard<T>(accountId: string, currency: Currency) {
  return apiRequest<T>(
    `/aws/accounts/${accountId}/dashboard?currency=${currency}`,
  );
}

export function getInstances<T>(accountId: string, currency: Currency) {
  return apiRequest<T>(
    `/aws/accounts/${accountId}/instances?currency=${currency}`,
  );
}
