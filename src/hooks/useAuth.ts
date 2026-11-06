"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getAuthConfig, loginWithGoogle } from "@/api/auth";

const authKeys = {
  all: ["auth"] as const,
  config: () => [...authKeys.all, "config"] as const,
};

export function useAuthConfig() {
  return useQuery({
    queryKey: authKeys.config(),
    queryFn: getAuthConfig,
    enabled: false,
    retry: false,
  });
}

export function useGoogleLogin() {
  return useMutation({ mutationFn: loginWithGoogle });
}
