import type { Currency } from "./costs";
import type { ExchangeRate } from "./reports";
import type { Freshness, WasteKind } from "./waste";

export type SimulationRequest = {
  recommendationIds: string[];
  trafficGrowthPercent: number;
};

export type SimulationSelectedItem = {
  recommendationId: string;
  instanceId: string;
  name: string | null;
  kind: WasteKind;
  kindLabel: string;
  action: string;
  monthlySavings: number;
};

export type SimulationCost = {
  monthlyCost: number | null;
  budgetRate: number | null;
};

export type SimulationBudget = {
  amount: number;
  enteredAmount: number;
  enteredCurrency: Currency;
};

export type SimulationResponse = {
  dataSource: "aws" | "demo";
  costBasis: "estimated_on_demand";
  currency: Currency;
  exchangeRate?: ExchangeRate | null;
  status: "OK" | "NO_FORECAST";
  trafficGrowthPercent: number;
  selectedCount: number;
  selected: SimulationSelectedItem[];
  selectedMonthlySavings: number | null;
  forecastMonthEndCost: number | null;
  before: SimulationCost | null;
  after: SimulationCost | null;
  monthlySavings: number | null;
  yearlySavings: number | null;
  budget: SimulationBudget | null;
  withinBudget: boolean | null;
  freshness: Freshness;
  notes: string[];
  asOf: string;
};
