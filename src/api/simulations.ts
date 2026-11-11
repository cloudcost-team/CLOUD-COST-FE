import { apiRequest } from "./client";
import type { Currency } from "./costs";
import { getSourceKey, type DataSource } from "./dataSource";

type SimulationRequest = {
  recommendationIds: string[];
  trafficGrowthPercent: number;
};

export const simulationKeys = {
  all: ["simulations"] as const,
  result: (source: DataSource, currency: Currency, input: SimulationRequest) =>
    [
      ...simulationKeys.all,
      getSourceKey(source),
      currency,
      input.recommendationIds,
      input.trafficGrowthPercent,
    ] as const,
};

export function simulate<T>(
  source: DataSource,
  currency: Currency,
  input: SimulationRequest,
) {
  const path =
    source.kind === "aws"
      ? `/aws/accounts/${source.account.accountId}/simulations`
      : "/demo/simulations";
  const body = source.kind === "aws" ? input : { ...source.setup, ...input };
  return apiRequest<T>(`${path}?currency=${currency}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
