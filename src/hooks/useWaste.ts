"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { DataSource } from "@/api/dataSource";
import {
  getResourceWaste,
  getWaste,
  wasteKeys,
  type WasteKind,
  type WasteSort,
} from "@/api/waste";
import { useCurrencyStore } from "@/stores/currencyStore";

const RESOURCE_REFRESH_POLL_MS = 15_000;

export function useWaste(
  source: DataSource,
  sort: WasteSort = "SAVINGS",
  type: WasteKind | null = null,
) {
  const currency = useCurrencyStore((state) => state.currency);
  return useQuery({
    queryKey: wasteKeys.list(source, currency, sort, type),
    queryFn: () => getWaste(source, currency, sort, type),
    placeholderData: keepPreviousData,
    refetchInterval: (query) =>
      query.state.data?.resources?.refreshing
        ? RESOURCE_REFRESH_POLL_MS
        : false,
  });
}

export function useResourceWaste(accountId: string, enabled: boolean) {
  const currency = useCurrencyStore((state) => state.currency);
  return useQuery({
    queryKey: wasteKeys.resources(accountId, currency),
    queryFn: () => getResourceWaste(accountId, currency),
    enabled,
    refetchInterval: (query) =>
      query.state.data?.resources.refreshing ? RESOURCE_REFRESH_POLL_MS : false,
  });
}
