"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { ApiError } from "@/api/client";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useSelectedConnectionStore } from "@/stores/selectedConnectionStore";
import { useSessionExpiredStore } from "@/stores/sessionExpiredStore";

const MAX_QUERY_RETRIES = 3;

function isUnauthorized(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}

function handleApiError(error: unknown) {
  if (isUnauthorized(error)) useSessionExpiredStore.getState().markExpired();
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: handleApiError }),
        mutationCache: new MutationCache({ onError: handleApiError }),
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: (failureCount, error) =>
              !isUnauthorized(error) && failureCount < MAX_QUERY_RETRIES,
          },
        },
      }),
  );

  useEffect(() => {
    useCurrencyStore.persist.rehydrate();
    useSelectedConnectionStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
