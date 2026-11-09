import { apiRequest } from "./client";

export type Currency = "KRW" | "USD";

export type DailyCostSpike = {
  ratio: number;
  baseline: number;
  baselineDays: number;
  causeInstanceId: string | null;
  causeName: string | null;
  message: string;
};

export type DailyCost = {
  date: string;
  usageHours: number;
  estimatedCost: number | null;
  spike: DailyCostSpike | null;
};

export type DailyCostsResponse = {
  currency: Currency;
  days: DailyCost[];
  notes: string[];
};

type DateRange = { from: string; to: string };

export const costKeys = {
  all: ["costs"] as const,
  daily: (accountId: string, currency: Currency, range: DateRange | null) =>
    [...costKeys.all, "daily", accountId, currency, range] as const,
  monthly: (accountId: string, currency: Currency, range: DateRange) =>
    [...costKeys.all, "monthly", accountId, currency, range] as const,
};

export function getDailyCosts<T = DailyCostsResponse>(
  accountId: string,
  currency: Currency,
  range: DateRange | null,
) {
  const params = new URLSearchParams({ currency, ...range });
  return apiRequest<T>(`/aws/accounts/${accountId}/costs/daily?${params}`);
}

export function getMonthlyCosts<T>(
  accountId: string,
  currency: Currency,
  range: DateRange,
) {
  const params = new URLSearchParams({ currency, ...range });
  return apiRequest<T>(`/aws/accounts/${accountId}/costs/monthly?${params}`);
}
