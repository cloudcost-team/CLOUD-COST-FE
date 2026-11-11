"use client";

import { useQuery } from "@tanstack/react-query";
import { costKeys, getDailyCosts, type Currency } from "@/api/costs";
import type { DataSource } from "@/api/dataSource";
import { getReport, getReports, reportKeys } from "@/api/reports";

export function useReports(source: DataSource, currency: Currency) {
  return useQuery({
    queryKey: reportKeys.list(source, currency),
    queryFn: () => getReports(source, currency),
  });
}

export function useReport(
  source: DataSource,
  month: string,
  currency: Currency,
) {
  return useQuery({
    queryKey: reportKeys.detail(source, month, currency),
    queryFn: () => getReport(source, month, currency),
    retry: false,
  });
}

export function useDailyCosts(
  source: DataSource,
  from: string,
  to: string,
  currency: Currency,
) {
  return useQuery({
    queryKey: costKeys.daily(source, currency, { from, to }),
    queryFn: () => getDailyCosts(source, currency, { from, to }),
  });
}
