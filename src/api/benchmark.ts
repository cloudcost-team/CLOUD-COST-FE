import { apiRequest } from "./client";
import type { Currency } from "./costs";

export const benchmarkKeys = {
  all: ["benchmark"] as const,
  detail: (
    accountId: string,
    currency: Currency,
    recommendationIds: string[],
  ) => [...benchmarkKeys.all, accountId, currency, recommendationIds] as const,
};

export function getBenchmark<T>(
  accountId: string,
  currency: Currency,
  recommendationIds: string[],
) {
  const params = new URLSearchParams({ currency });
  recommendationIds.forEach((id) => params.append("recommendationIds", id));
  return apiRequest<T>(`/aws/accounts/${accountId}/benchmark?${params}`);
}
