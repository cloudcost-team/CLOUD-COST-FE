import type { Currency } from "./costs";
import { getSourceKey, requestFromSource, type DataSource } from "./dataSource";

export const benchmarkKeys = {
  all: ["benchmark"] as const,
  detail: (
    source: DataSource,
    currency: Currency,
    recommendationIds: string[],
  ) =>
    [
      ...benchmarkKeys.all,
      getSourceKey(source),
      currency,
      recommendationIds,
    ] as const,
};

export function getBenchmark<T>(
  source: DataSource,
  currency: Currency,
  recommendationIds: string[],
) {
  const params = new URLSearchParams({ currency });
  if (source.kind === "demo")
    return requestFromSource<T>(source, "/benchmark", params, {
      recommendationIds,
    });
  recommendationIds.forEach((id) => params.append("recommendationIds", id));
  return requestFromSource<T>(source, "/benchmark", params);
}
