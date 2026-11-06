import type { Currency } from "./costs";
import type { ExchangeRate } from "./reports";

export type BenchmarkServer = {
  instanceId: string;
  name: string | null;
  instanceType: string | null;
  cpuP95: number;
  cpuHours: number;
  oversized: boolean;
  verdict: string;
};

export type BenchmarkRatio = {
  judgedCount: number;
  oversizedCount: number;
  ratio: number | null;
};

export type BenchmarkOversizedReference = {
  source: string;
  description: string;
  sizeBand: string | null;
  sizeBandLabel: string | null;
  dataAvailable: boolean;
  sampleSize: number;
  averageRatio: number | null;
  medianRatio: number | null;
  percentileAvailable: boolean;
};

export type BenchmarkSizeBand = {
  key: string;
  label: string;
  minServers: number;
  maxServers: number;
  dataAvailable: boolean;
  matchesOurs: boolean;
};

export type BenchmarkOversizedRatio = {
  status: "OK" | "NOT_COMPARABLE" | "INSUFFICIENT_HISTORY";
  ours: BenchmarkRatio | null;
  moreEfficientTeamsPercent: number | null;
  matchedSizeBand: string | null;
  reference: BenchmarkOversizedReference;
  sizeBands: BenchmarkSizeBand[];
  servers: BenchmarkServer[];
  afterSimulation: BenchmarkRatio | null;
};

export type BenchmarkWasteRatio = {
  status: "UNAVAILABLE";
  reason: string;
  referenceSource: string;
  referenceDescription: string;
  referenceAverage: number;
};

export type BenchmarkSpendPosition = "BELOW" | "WITHIN" | "ABOVE";

export type BenchmarkSpendRange = {
  source: string;
  description: string;
  min: number;
  max: number;
  minUsd: number;
  maxUsd: number;
};

export type BenchmarkMonthlySpend = {
  status: "OK" | "NO_FORECAST";
  monthlyCost: number | null;
  position: BenchmarkSpendPosition | null;
  range: BenchmarkSpendRange;
  afterSimulation: {
    monthlyCost: number;
    position: BenchmarkSpendPosition;
  } | null;
};

export type BenchmarkFreshness = {
  instancesRefreshedAt: string | null;
  instancesFromCache: boolean;
  usageRefreshedAt: string | null;
  usageFromCache: boolean;
  nextUsageRefreshAt: string | null;
  warnings: string[];
};

export type BenchmarkResponse = {
  dataSource: "aws" | "demo";
  costBasis: "estimated_on_demand";
  currency: Currency;
  exchangeRate: ExchangeRate | null;
  accountId: string | null;
  status: "OK" | "INSUFFICIENT_HISTORY";
  availableAt: string | null;
  window: { from: string; to: string };
  appliedRecommendationIds: string[];
  oversizedRatio: BenchmarkOversizedRatio;
  wasteRatio: BenchmarkWasteRatio;
  monthlySpend: BenchmarkMonthlySpend;
  freshness: BenchmarkFreshness;
  notes: string[];
  asOf: string;
};
