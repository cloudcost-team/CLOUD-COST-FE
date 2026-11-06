import { apiRequest } from "./client";
import type { Currency } from "./costs";

export type BudgetCurrency = Currency;

export type Budget = {
  amount: number | null;
  enteredAmount: number;
  enteredCurrency: BudgetCurrency;
  usageRate: number | null;
  thresholdReached: 80 | 100 | 120 | null;
};

export type BudgetResponse = {
  dataSource: "aws";
  currency: BudgetCurrency;
  accountId: string;
  budget: Budget | null;
  forecastMonthEndCost: number | null;
  recentAverage: { monthlyCost: number; months: string[] } | null;
  slider: { min: number; max: number; step: number; suggested: number };
  notes: string[];
  asOf: string;
};

export type SaveBudgetRequest = {
  amount: number;
  currency: BudgetCurrency;
};

export const budgetKeys = {
  all: ["budget"] as const,
  detail: (accountId: string, currency: BudgetCurrency) =>
    [...budgetKeys.all, accountId, currency] as const,
};

export function getBudget(accountId: string, currency: BudgetCurrency) {
  return apiRequest<BudgetResponse>(
    `/aws/accounts/${accountId}/budget?currency=${currency}`,
  );
}

export function saveBudget(accountId: string, input: SaveBudgetRequest) {
  return apiRequest<{ accountId: string } & SaveBudgetRequest>(
    `/aws/accounts/${accountId}/budget`,
    { method: "PUT", body: JSON.stringify(input) },
  );
}
