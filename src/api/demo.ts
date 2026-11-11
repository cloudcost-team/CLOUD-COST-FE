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

export type DemoOs = "LINUX" | "WINDOWS";
export type DemoSchedule =
  "ALWAYS" | "WEEKDAY_OFFICE" | "DAILY_HOURS" | "MONTHLY_SPIKE";

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
  recommendationIds?: string[];
  trafficGrowthPercent?: number;
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

export function loginDemo(input: DemoLoginRequest) {
  return apiRequest<DemoAccount>("/demo/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getDemoCatalog() {
  return apiRequest<DemoCatalog>("/demo/catalog");
}
