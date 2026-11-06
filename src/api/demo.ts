import { apiRequest } from "./client";

type DemoLoginRequest = {
  username: string;
  password: string;
};

type DemoAccount = {
  dataSource: "demo";
  accountId: string;
  name: string;
  awsAccountId: string;
  region: string;
};

export type DemoCurrency = "KRW" | "USD";
export type DemoOs = "LINUX" | "WINDOWS";
export type DemoSchedule = "ALWAYS" | "WEEKDAY_OFFICE" | "DAILY_HOURS";

export type DemoSetupRequest = {
  from: string;
  to: string;
  servers: Array<{
    name: string;
    instanceType: string;
    os: DemoOs;
    count: number;
    schedule: DemoSchedule;
    hoursPerDay?: number;
    usagePattern?: string;
  }>;
};

export type DemoCatalog = {
  instanceTypes: Array<{
    instanceType: string;
    linuxHourlyUsd: number;
    windowsHourlyUsd: number;
  }>;
  os: DemoOs[];
  schedules: Array<{ code: DemoSchedule; label: string }>;
  usagePatterns: Array<{ code: string; label: string }>;
  maxServers: number;
  maxCountPerServer: number;
  maxInstances: number;
  priceNote: string;
};

type InstanceUsage = {
  instanceId: string;
  name: string | null;
  instanceType: string | null;
  state: string;
  usageHours: number;
  estimatedHourlyCost: number | null;
  estimatedCost: number | null;
  note: string;
};

export type DemoCostSummary = {
  dataSource: "demo";
  currency: DemoCurrency;
  from: string;
  to: string;
  usageHours: number;
  estimatedCost: number;
  instances: InstanceUsage[];
  notes: string[];
};

export type DemoDailyCost = {
  dataSource: "demo";
  currency: DemoCurrency;
  from: string;
  to: string;
  usageHours: number;
  estimatedCost: number;
  days: Array<{
    date: string;
    usageHours: number;
    estimatedCost: number;
    instances: InstanceUsage[];
  }>;
  notes: string[];
};

export function loginDemo(input: DemoLoginRequest) {
  return apiRequest<DemoAccount>("/demo/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getDemoCatalog() {
  return apiRequest<DemoCatalog>("/demo/catalog");
}

function postDemo<T>(
  path: string,
  input: DemoSetupRequest,
  currency: DemoCurrency,
) {
  return apiRequest<T>(`${path}?currency=${currency}`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getDemoCosts(input: DemoSetupRequest, currency: DemoCurrency) {
  return postDemo<DemoCostSummary>("/demo/costs", input, currency);
}

export function getDemoDailyCosts(
  input: DemoSetupRequest,
  currency: DemoCurrency,
) {
  return postDemo<DemoDailyCost>("/demo/costs/daily", input, currency);
}
