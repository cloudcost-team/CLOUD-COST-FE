"use client";

import { useQuery } from "@tanstack/react-query";
import { costKeys, getDailyCosts, type Currency } from "@/api/costs";
import { getReport, getReports, reportKeys } from "@/api/reports";

export function useReports(accountId: string, currency: Currency) {
  return useQuery({
    queryKey: reportKeys.list(accountId, currency),
    queryFn: () => getReports(accountId, currency),
  });
}

export function useReport(
  accountId: string,
  month: string,
  currency: Currency,
) {
  return useQuery({
    queryKey: reportKeys.detail(accountId, month, currency),
    queryFn: () => getReport(accountId, month, currency),
    retry: false,
  });
}

export function useDailyCosts(
  accountId: string,
  from: string,
  to: string,
  currency: Currency,
) {
  return useQuery({
    queryKey: costKeys.daily(accountId, currency, { from, to }),
    queryFn: () => getDailyCosts(accountId, currency, { from, to }),
  });
}
