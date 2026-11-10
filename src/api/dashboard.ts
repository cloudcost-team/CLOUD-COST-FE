import type { Currency } from "./costs";
import { getSourceKey, requestFromSource, type DataSource } from "./dataSource";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: (source: DataSource, currency: Currency) =>
    [...dashboardKeys.all, "summary", getSourceKey(source), currency] as const,
  instances: (source: DataSource, currency: Currency) =>
    [
      ...dashboardKeys.all,
      "instances",
      getSourceKey(source),
      currency,
    ] as const,
};

export function getDashboard<T>(source: DataSource, currency: Currency) {
  return requestFromSource<T>(
    source,
    "/dashboard",
    new URLSearchParams({ currency }),
  );
}

export function getInstances<T>(source: DataSource, currency: Currency) {
  return requestFromSource<T>(
    source,
    "/instances",
    new URLSearchParams({ currency }),
  );
}
