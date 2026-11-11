"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { DataSource } from "@/api/dataSource";
import {
  getWaste,
  wasteKeys,
  type WasteKind,
  type WasteSort,
} from "@/api/waste";
import { useCurrencyStore } from "@/stores/currencyStore";

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
  });
}
