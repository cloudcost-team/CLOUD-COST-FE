import type { Currency } from "./costs";
import { getSourceKey, requestFromSource, type DataSource } from "./dataSource";

export const wasteKeys = {
  all: ["waste"] as const,
  list: (
    source: DataSource,
    currency: Currency,
    sort: string,
    type: string | null,
  ) => [...wasteKeys.all, getSourceKey(source), currency, sort, type] as const,
};

export function getWaste<T>(
  source: DataSource,
  currency: Currency,
  sort: string,
  type: string | null,
) {
  const params = new URLSearchParams({ currency, sort });
  if (type) params.set("type", type);
  return requestFromSource<T>(source, "/waste", params);
}
