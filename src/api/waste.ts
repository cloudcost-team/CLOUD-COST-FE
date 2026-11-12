import { apiRequest } from "./client";
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

export type ResourceScanStatus =
  "NOT_SCANNED" | "OK" | "PERMISSION_UPGRADE_REQUIRED" | "FAILED";

export type ResourceScan = {
  status: ResourceScanStatus;
  permissionVersion: number;
  scannedAt: string | null;
  message: string | null;
};

export type PermissionUpgrade = {
  method: "STACK" | "MANUAL_ROLE";
  stackName: string | null;
  consoleUrl: string;
  templateUrl: string | null;
  permissionPolicy: Record<string, unknown> | null;
  steps: string[];
};

export type ResourceWasteKind =
  | "UNATTACHED_VOLUME"
  | "UNUSED_EIP"
  | "OLD_SNAPSHOT"
  | "IDLE_LB"
  | "FORGOTTEN_REGION";

export type ResourceType =
  "INSTANCE" | "VOLUME" | "ADDRESS" | "SNAPSHOT" | "LOAD_BALANCER";

export type ResourceWasteItem = {
  recommendationId: string;
  kind: ResourceWasteKind;
  kindLabel: string;
  resourceType: ResourceType;
  resourceTypeLabel: string;
  resourceId: string;
  name: string;
  region: string;
  otherRegion: boolean;
  monthlyCost: number | null;
  evidence: string;
  action: string;
  consoleSteps: string[];
  cautions: string[];
  priceNote: string | null;
};

export type RegionServerCount = {
  region: string;
  runningServers: number;
};

export type ResourceWaste = {
  costBasis: string;
  currency: Currency;
  homeRegion: string;
  scan: ResourceScan;
  upgrade: PermissionUpgrade | null;
  refreshing: boolean;
  findingCount: number;
  totalMonthlyCost: number | null;
  otherRegions: RegionServerCount[];
  items: ResourceWasteItem[];
  notes: string[];
};

export type ResourceWasteResponse = {
  dataSource: "aws" | "csv" | "demo";
  exchangeRate: ExchangeRate | null;
  accountId: string;
  resources: ResourceWaste;
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
  resources?: ResourceWaste | null;
};

export const wasteKeys = {
  all: ["waste"] as const,
  list: (
    source: DataSource,
    currency: Currency,
    sort: WasteSort,
    type: WasteKind | null,
  ) => [...wasteKeys.all, getSourceKey(source), currency, sort, type] as const,
  resources: (accountId: string, currency: Currency) =>
    [...wasteKeys.all, "resources", accountId, currency] as const,
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

export function getResourceWaste(accountId: string, currency: Currency) {
  return apiRequest<ResourceWasteResponse>(
    `/aws/accounts/${accountId}/resources/waste?${new URLSearchParams({ currency })}`,
  );
}
