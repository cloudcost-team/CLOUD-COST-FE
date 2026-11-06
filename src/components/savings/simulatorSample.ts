import type { SimulationResponse } from "@/api/simulations";
import { wasteSample } from "./wasteSample";

const selectedItems = wasteSample.items.map((item) => ({
  recommendationId: item.recommendationId,
  instanceId: item.instanceId,
  name: item.name,
  kind: item.kind,
  kindLabel: item.kindLabel,
  action: item.action,
  monthlySavings: item.estimatedMonthlySavings,
}));

const base = {
  dataSource: "aws",
  costBasis: "estimated_on_demand",
  currency: "KRW",
  exchangeRate: null,
  status: "OK",
  trafficGrowthPercent: 0,
  forecastMonthEndCost: 312000,
  withinBudget: true,
  freshness: wasteSample.freshness,
  notes: [],
  asOf: "2026-11-04T02:00:00Z",
} satisfies Partial<SimulationResponse>;

export const simulationSample: SimulationResponse = {
  ...base,
  selectedCount: 3,
  selected: selectedItems,
  selectedMonthlySavings: 132000,
  before: { monthlyCost: 312000, budgetRate: 78 },
  after: { monthlyCost: 180000, budgetRate: 45 },
  monthlySavings: 132000,
  yearlySavings: 1584000,
  budget: { amount: 400000, enteredAmount: 400000, enteredCurrency: "KRW" },
};

export const singleSimulationSample: SimulationResponse = {
  ...base,
  selectedCount: 1,
  selected: selectedItems.slice(0, 1),
  selectedMonthlySavings: 65700,
  before: { monthlyCost: 312000, budgetRate: null },
  after: { monthlyCost: 246300, budgetRate: null },
  monthlySavings: 65700,
  yearlySavings: 788400,
  budget: null,
  withinBudget: null,
};
