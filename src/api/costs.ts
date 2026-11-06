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

export const costKeys = {
  daily: (accountId: string, from: string, to: string, currency: Currency) =>
    ["costs", "daily", accountId, from, to, currency] as const,
};

export function getDailyCosts(
  accountId: string,
  from: string,
  to: string,
  currency: Currency,
) {
  const params = new URLSearchParams({ from, to, currency });
  return apiRequest<DailyCostsResponse>(
    `/aws/accounts/${accountId}/costs/daily?${params}`,
  );
}
