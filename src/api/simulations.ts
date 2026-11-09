import { apiRequest } from "./client";
import type { Currency } from "./costs";

type SimulationRequest = {
  recommendationIds: string[];
  trafficGrowthPercent: number;
};

export const simulationKeys = {
  all: ["simulations"] as const,
  result: (accountId: string, currency: Currency, input: SimulationRequest) =>
    [
      ...simulationKeys.all,
      accountId,
      currency,
      input.recommendationIds,
      input.trafficGrowthPercent,
    ] as const,
};

export function simulate<T>(
  accountId: string,
  currency: Currency,
  input: SimulationRequest,
) {
  return apiRequest<T>(
    `/aws/accounts/${accountId}/simulations?currency=${currency}`,
    { method: "POST", body: JSON.stringify(input) },
  );
}
