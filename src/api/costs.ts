import { getSourceKey, requestFromSource, type DataSource } from "./dataSource";

export type Currency = "KRW" | "USD";

export type DailyCostSpike = {
  ratio: number;
  baseline: number;
  baselineDays: number;
  causeInstanceId: string | null;
  causeName: string | null;
  causeUsageHours: number | null;
  causeBaselineHours: number | null;
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
  daily: (source: DataSource, currency: Currency, range: DateRange | null) =>
    [...costKeys.all, "daily", getSourceKey(source), currency, range] as const,
  monthly: (source: DataSource, currency: Currency, range: DateRange) =>
    [
      ...costKeys.all,
      "monthly",
      getSourceKey(source),
      currency,
      range,
    ] as const,
};

function costParams(
  source: DataSource,
  currency: Currency,
  range: DateRange | null,
) {
  return new URLSearchParams(
    source.kind === "aws" ? { currency, ...range } : { currency },
  );
}

export function getDailyCosts<T = DailyCostsResponse>(
  source: DataSource,
  currency: Currency,
  range: DateRange | null,
) {
  return requestFromSource<T>(
    source,
    "/costs/daily",
    costParams(source, currency, range),
  );
}

export function getMonthlyCosts<T>(
  source: DataSource,
  currency: Currency,
  range: DateRange,
) {
  return requestFromSource<T>(
    source,
    "/costs/monthly",
    costParams(source, currency, range),
  );
}
