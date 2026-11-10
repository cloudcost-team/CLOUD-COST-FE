import type { Currency } from "./costs";
import { getSourceKey, requestFromSource, type DataSource } from "./dataSource";

export type ReportStatus = "EMPTY" | "FIRST_MONTH" | "PREVIEW" | "FINAL";

export type ExchangeRate = {
  base: "USD";
  quote: "KRW";
  rate: number;
  date: string;
  source: string;
};

export type ReportMonthSummary = {
  month: string;
  status: ReportStatus;
  statusLabel: string;
  usageHours: number;
  estimatedCost: number | null;
  previousMonthCost: number | null;
  change: number | null;
  changeRate: number | null;
};

export type ReportListResponse = {
  dataSource: "aws";
  currency: Currency;
  exchangeRate?: ExchangeRate | null;
  availableFrom: string | null;
  months: ReportMonthSummary[];
  notes: string[];
  asOf: string;
};

export type ReportSpikeDay = {
  date: string;
  ratio: number;
  causeInstanceId: string | null;
  causeName: string | null;
  message: string;
};

export type ReportSavingsItem = {
  recommendationId: string;
  instanceId: string;
  name: string | null;
  kind: "OVERSIZED" | "IDLE";
  kindLabel: string;
  action: string;
  monthlySavings: number;
};

export type ReportTopServer = {
  instanceId: string | null;
  name: string | null;
  instanceType: string | null;
  others: boolean;
  usageHours: number;
  estimatedCost: number;
  share: number;
};

export type ReportDetailResponse = {
  currency?: Currency;
  exchangeRate?: ExchangeRate | null;
  month: string;
  status: ReportStatus;
  statusLabel: string;
  from: string;
  to: string;
  summary: ReportMonthSummary;
  spikes: { count: number; days: ReportSpikeDay[] };
  savings: {
    status: "OK" | "NONE_FOUND" | "INSUFFICIENT_HISTORY";
    window: { from: string; to: string };
    count: number;
    monthlySavings: number;
    items: ReportSavingsItem[];
  } | null;
  topServers: ReportTopServer[];
  notes: string[];
};

export const reportKeys = {
  all: ["reports"] as const,
  list: (source: DataSource, currency: Currency) =>
    [...reportKeys.all, "list", getSourceKey(source), currency] as const,
  detail: (source: DataSource, month: string, currency: Currency) =>
    [
      ...reportKeys.all,
      "detail",
      getSourceKey(source),
      month,
      currency,
    ] as const,
};

export function getReports(source: DataSource, currency: Currency) {
  return requestFromSource<ReportListResponse>(
    source,
    "/reports",
    new URLSearchParams({ currency }),
  );
}

export function getReport(
  source: DataSource,
  month: string,
  currency: Currency,
) {
  return requestFromSource<ReportDetailResponse>(
    source,
    `/reports/${month}`,
    new URLSearchParams({ currency }),
  );
}
