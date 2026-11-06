"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  awsAccountKeys,
  createAwsAccount,
  deleteAwsAccount,
  getAwsAccount,
  listAwsAccounts,
  listSyncJobs,
  registerAwsAccountRole,
  renameAwsAccount,
} from "@/api/awsAccounts";

const PENDING_POLL_MS = 5_000;

export function useAwsAccounts(includePending: boolean) {
  return useQuery({
    queryKey: awsAccountKeys.list(includePending),
    queryFn: () => listAwsAccounts(includePending),
  });
}

export function useCreateAwsAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAwsAccount,
    onSuccess: (data) => {
      queryClient.setQueryData(
        awsAccountKeys.detail(data.account.accountId),
        data,
      );
      queryClient.invalidateQueries({ queryKey: awsAccountKeys.all });
    },
  });
}

export function useAwsAccount(accountId: string | null) {
  return useQuery({
    queryKey: awsAccountKeys.detail(accountId ?? ""),
    queryFn: () => getAwsAccount(accountId ?? ""),
    enabled: accountId !== null,
    refetchInterval: (query) =>
      query.state.data?.account.status === "PENDING" ? PENDING_POLL_MS : false,
  });
}

export function useSyncJobs(accountId: string) {
  return useQuery({
    queryKey: awsAccountKeys.syncJobs(accountId),
    queryFn: () => listSyncJobs(accountId),
  });
}

export function useRegisterAwsAccountRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      accountId,
      roleArn,
    }: {
      accountId: string;
      roleArn: string;
    }) => registerAwsAccountRole(accountId, roleArn),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: awsAccountKeys.all }),
  });
}

export function useRenameAwsAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ accountId, alias }: { accountId: string; alias: string }) =>
      renameAwsAccount(accountId, alias),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: awsAccountKeys.all }),
  });
}

export function useDeleteAwsAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAwsAccount,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [...awsAccountKeys.all, "list"],
      }),
  });
}
