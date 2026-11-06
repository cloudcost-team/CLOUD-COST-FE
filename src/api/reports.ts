import type { Currency } from "./costs";
import { apiRequest } from "./client";

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
  list: (accountId: string, currency: Currency) =>
    [...reportKeys.all, "list", accountId, currency] as const,
  detail: (accountId: string, month: string, currency: Currency) =>
    [...reportKeys.all, "detail", accountId, month, currency] as const,
};

export function getReports(accountId: string, currency: Currency) {
  return apiRequest<ReportListResponse>(
    `/aws/accounts/${accountId}/reports?currency=${currency}`,
  );
}

export function getReport(
  accountId: string,
  month: string,
  currency: Currency,
) {
  return apiRequest<ReportDetailResponse>(
    `/aws/accounts/${accountId}/reports/${month}?currency=${currency}`,
  );
}
