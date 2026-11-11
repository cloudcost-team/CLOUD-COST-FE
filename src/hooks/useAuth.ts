"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getAuthConfig, getMe, loginWithGoogle, logout } from "@/api/auth";

const authKeys = {
  all: ["auth"] as const,
  config: () => [...authKeys.all, "config"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export function useAuthConfig() {
  return useQuery({
    queryKey: authKeys.config(),
    queryFn: getAuthConfig,
    retry: false,
  });
}

export function useGoogleLogin() {
  return useMutation({ mutationFn: loginWithGoogle });
}

export function useMe({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({ queryKey: authKeys.me(), queryFn: getMe, enabled });
}

export function useLogout() {
  return useMutation({ mutationFn: logout });
}
