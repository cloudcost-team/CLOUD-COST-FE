"use client";

import type { AwsAccount } from "@/api/awsAccounts";
import { useSelectedConnectionStore } from "@/stores/selectedConnectionStore";
import { useAwsAccounts } from "./useAwsAccounts";

function isViewable(account: AwsAccount) {
  return (
    account.status === "ACTIVE" ||
    (account.status === "ERROR" && account.verifiedAt !== null)
  );
}

export function useSelectedConnection() {
  const accountsQuery = useAwsAccounts(false);
  const selectedId = useSelectedConnectionStore((state) => state.accountId);
  const select = useSelectedConnectionStore((state) => state.select);
  const connections = (accountsQuery.data ?? []).filter(isViewable);
  const selected =
    connections.find((account) => account.accountId === selectedId) ??
    connections[0] ??
    null;

  return {
    connections,
    selected,
    select,
    isPending: accountsQuery.isPending,
    error: accountsQuery.error,
    refetch: accountsQuery.refetch,
  };
}
