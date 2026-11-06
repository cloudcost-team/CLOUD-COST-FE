"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  alertKeys,
  getAlertSettings,
  getNotifications,
  getUnreadNotificationCount,
  notificationKeys,
  readAllNotifications,
  readNotification,
  updateAlertConditions,
  type AlertConditions,
  type AlertSettings,
} from "@/api/alerts";
import {
  budgetKeys,
  getBudget,
  saveBudget,
  type BudgetCurrency,
} from "@/api/budget";

const UNREAD_POLL_MS = 5 * 60_000;
const PAGE_SIZE = 20;

export function useAlertSettings() {
  return useQuery({ queryKey: alertKeys.settings, queryFn: getAlertSettings });
}

export function useUpdateAlertConditions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAlertConditions,
    onMutate: async (conditions: AlertConditions) => {
      await queryClient.cancelQueries({ queryKey: alertKeys.settings });
      const previous = queryClient.getQueryData<AlertSettings>(
        alertKeys.settings,
      );
      if (previous)
        queryClient.setQueryData(alertKeys.settings, {
          ...previous,
          ...conditions,
        });
      return { previous };
    },
    onError: (_error, _conditions, context) => {
      if (context?.previous)
        queryClient.setQueryData(alertKeys.settings, context.previous);
    },
    onSuccess: (settings) =>
      queryClient.setQueryData(alertKeys.settings, settings),
  });
}

export function useBudget(accountId: string | null, currency: BudgetCurrency) {
  return useQuery({
    queryKey: budgetKeys.detail(accountId ?? "", currency),
    queryFn: () => getBudget(accountId ?? "", currency),
    enabled: accountId !== null,
    retry: false,
  });
}

export function useSaveBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      accountId,
      amount,
      currency,
    }: {
      accountId: string;
      amount: number;
      currency: BudgetCurrency;
    }) => saveBudget(accountId, { amount, currency }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      queryClient.invalidateQueries({ queryKey: alertKeys.settings });
    },
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
    refetchInterval: UNREAD_POLL_MS,
  });
}

export function useRecentNotifications(limit: number, enabled = true) {
  return useQuery({
    queryKey: notificationKeys.list(limit),
    queryFn: () => getNotifications(limit),
    enabled,
  });
}

export function useNotificationPages() {
  return useInfiniteQuery({
    queryKey: notificationKeys.pages(),
    queryFn: ({ pageParam }) => getNotifications(PAGE_SIZE, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (page) => page.nextCursor,
  });
}

export function useReadNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: readNotification,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
}

export function useReadAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: readAllNotifications,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
}
