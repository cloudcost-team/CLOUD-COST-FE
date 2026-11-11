import type { Currency } from "./costs";
import { getSourceKey, requestFromSource, type DataSource } from "./dataSource";
import type { ExchangeRate } from "./reports";

export type WasteStatus = "OK" | "NONE_FOUND" | "INSUFFICIENT_HISTORY";

export type WasteKind = "OVERSIZED" | "IDLE";

export type WasteSort = "SAVINGS" | "COST" | "UTILIZATION" | "NAME";

export type Freshness = {
  instancesRefreshedAt: string | null;
  instancesFromCache: boolean;
  usageRefreshedAt: string | null;
  usageFromCache: boolean;
  nextUsageRefreshAt: string | null;
  warnings: string[];
  warningDetails?: { code: string; message: string }[];
};

export type WasteSummaryLine = {
  title: string;
  detail: string;
};

export type WasteBasis = {
  projectedCpuP95: number;
  targetBaselinePercent: number;
  nextCandidate: { instanceType: string; hourlyCost: number } | null;
};

export type WasteCpuPoint = {
  hour: string;
  avg: number;
  max: number;
};

export type WasteCpuChart = {
  points: WasteCpuPoint[];
  max: number;
  maxAt: string;
  baselinePercent: number | null;
  baselineLabel: string | null;
};

export type WasteMetrics = {
  cpuAvg: number;
  cpuP95: number;
  cpuMax: number;
  networkBytes: number;
  cpuHours: number;
};

export type WasteInstanceSpec = {
  instanceType: string;
  vcpu: number;
  memoryGib: number;
  hourlyCost: number;
  monthlyCostAt730h: number;
};

export type WasteItem = {
  recommendationId: string;
  instanceId: string;
  name: string | null;
  instanceType: string;
  state: string;
  kind: WasteKind;
  kindLabel: string;
  evidence: string;
  action: string;
  reason: string;
  memoryCheckNeeded: boolean;
  summary: WasteSummaryLine[];
  summaryNote: string | null;
  basis: WasteBasis | null;
  cpuChart: WasteCpuChart;
  metrics: WasteMetrics;
  monthlyHours: number;
  estimatedMonthlyCost: number;
  estimatedMonthlySavings: number;
  comparison: {
    current: WasteInstanceSpec;
    recommended: WasteInstanceSpec | null;
  };
  cautions: string[];
  consoleSteps: string[];
};

export type WasteSkipped = {
  instanceId: string;
  name: string | null;
  reason: string;
};

export type WasteResponse = {
  dataSource: "aws" | "demo";
  costBasis: "estimated_on_demand";
  currency: Currency;
  exchangeRate?: ExchangeRate | null;
  status: WasteStatus;
  availableAt: string | null;
  window: { from: string; to: string };
  sort?: WasteSort;
  type?: WasteKind | null;
  totalMonthlySavings: number;
  forecastMonthEndCost: number | null;
  savingsRateOfForecast: number | null;
  findingCount: number;
  counts: { oversized: number; idle: number };
  judgedCount: number;
  items: WasteItem[];
  skipped: WasteSkipped[];
  freshness: Freshness;
  notes: string[];
  asOf: string;
};

export const wasteKeys = {
  all: ["waste"] as const,
  list: (
    source: DataSource,
    currency: Currency,
    sort: WasteSort,
    type: WasteKind | null,
  ) => [...wasteKeys.all, getSourceKey(source), currency, sort, type] as const,
};

export function getWaste(
  source: DataSource,
  currency: Currency,
  sort: WasteSort,
  type: WasteKind | null,
) {
  const params = new URLSearchParams({ currency, sort });
  if (type) params.set("type", type);
  return requestFromSource<WasteResponse>(source, "/waste", params);
}
