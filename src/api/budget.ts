import { apiRequest } from "./client";
import type { Currency } from "./costs";
import type { DataSource } from "./dataSource";

export type BudgetCurrency = Currency;

export type Budget = {
  amount: number | null;
  enteredAmount: number;
  enteredCurrency: BudgetCurrency;
  usageRate: number | null;
  thresholdReached: 80 | 100 | 120 | null;
};

export type BudgetTarget =
  { kind: "aws"; accountId: string } | Extract<DataSource, { kind: "demo" }>;

export type BudgetResponse = {
  dataSource: "aws" | "demo";
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
  detail: (target: BudgetTarget, currency: BudgetCurrency) =>
    [
      ...budgetKeys.all,
      target.kind === "aws" ? target.accountId : target.setup,
      currency,
    ] as const,
};

export function getBudget(target: BudgetTarget, currency: BudgetCurrency) {
  if (target.kind === "aws")
    return apiRequest<BudgetResponse>(
      `/aws/accounts/${target.accountId}/budget?currency=${currency}`,
    );
  return apiRequest<BudgetResponse>(`/demo/budget?currency=${currency}`, {
    method: "POST",
    body: JSON.stringify(target.setup),
  });
}

export function saveBudget(accountId: string, input: SaveBudgetRequest) {
  return apiRequest<{ accountId: string } & SaveBudgetRequest>(
    `/aws/accounts/${accountId}/budget`,
    { method: "PUT", body: JSON.stringify(input) },
  );
}
