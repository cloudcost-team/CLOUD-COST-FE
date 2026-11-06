import type { Currency, DailyCost } from "./costs";
import type { ExchangeRate } from "./reports";

export type CostFreshness = {
  instancesRefreshedAt: string | null;
  instancesFromCache: boolean;
  usageRefreshedAt: string | null;
  usageFromCache: boolean;
  nextUsageRefreshAt: string | null;
  warnings: string[];
};

type CostEnvelope = {
  dataSource: "aws";
  costBasis: "estimated_on_demand";
  currency: Currency;
  exchangeRate: ExchangeRate | null;
  freshness: CostFreshness;
  notes: string[];
};

export type InstanceCost = {
  instanceId: string;
  name: string | null;
  instanceType: string;
  state: string;
  usageHours: number;
  estimatedHourlyCost: number | null;
  estimatedCost: number | null;
  note: string | null;
};

export type CostsSummaryResponse = CostEnvelope & {
  from: string;
  to: string;
  availableFrom: string | null;
  usageHours: number;
  estimatedCost: number | null;
  instances: InstanceCost[];
};

export type DailyCostWithInstances = DailyCost & {
  instances: InstanceCost[];
};

export type DailyCostsWithInstancesResponse = CostEnvelope & {
  from: string;
  to: string;
  availableFrom: string | null;
  days: DailyCostWithInstances[];
};

export type MonthlyCost = {
  month: string;
  usageHours: number;
  estimatedCost: number | null;
  estimatedCostChange: number | null;
  instances: InstanceCost[];
};

export type MonthlyCostsResponse = CostEnvelope & {
  availableFrom: string | null;
  months: MonthlyCost[];
};

export type Ec2Instance = {
  instanceId: string;
  name: string | null;
  instanceType: string;
  region: string;
  availabilityZone: string;
  state: string;
  launchTime: string;
  platformDetails: string;
  tenancy: string;
  spot: boolean;
  present: boolean;
  currentRun: { since: string; hours: number; note: string } | null;
  estimatedHourlyCost: number | null;
  note: string | null;
};

export type InstancesResponse = CostEnvelope & {
  instances: Ec2Instance[];
};

export type DashboardBudget = {
  amount: number | null;
  enteredAmount: number;
  enteredCurrency: Currency;
  usageRate: number | null;
  thresholdReached: number | null;
};

export type DashboardLatestSpike = {
  date: string;
  cost: number;
  ratio: number;
  baseline: number;
  baselineDays: number;
  causeInstanceId: string | null;
  causeName: string | null;
  message: string;
};

export type DashboardResponse = CostEnvelope & {
  timezone: string;
  today: string;
  month: string;
  availableFrom: string | null;
  monthToDate: {
    from: string;
    to: string;
    usageHours: number;
    estimatedCost: number | null;
  };
  instanceCounts: { running: number; stopped: number };
  forecast: {
    monthEndCost: number;
    costThroughYesterday: number;
    dailyAverage: number;
    basisFrom: string;
    basisTo: string;
    basisDays: number;
    remainingDays: number;
  } | null;
  budget: DashboardBudget | null;
  previousMonthSamePeriod: {
    currentFrom: string;
    currentTo: string;
    currentCost: number;
    previousFrom: string;
    previousTo: string;
    previousCost: number;
    change: number;
    changeRate: number | null;
  } | null;
  latestSpike: DashboardLatestSpike | null;
  asOf: string;
};
