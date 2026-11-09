import { apiRequest } from "./client";
import type { Currency } from "./costs";

export const wasteKeys = {
  all: ["waste"] as const,
  list: (
    accountId: string,
    currency: Currency,
    sort: string,
    type: string | null,
  ) => [...wasteKeys.all, accountId, currency, sort, type] as const,
};

export function getWaste<T>(
  accountId: string,
  currency: Currency,
  sort: string,
  type: string | null,
) {
  const params = new URLSearchParams({ currency, sort });
  if (type) params.set("type", type);
  return apiRequest<T>(`/aws/accounts/${accountId}/waste?${params}`);
}
