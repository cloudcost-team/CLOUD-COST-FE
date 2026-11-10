"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { DemoSetupRequest } from "@/api/demo";

const DEMO_SETUP_KEY = "cloudcost.demoSetup";

export const demoSetupQueryKey = ["demo", "stored-setup"] as const;

function readDemoSetup(): DemoSetupRequest | null {
  const raw = sessionStorage.getItem(DEMO_SETUP_KEY);
  if (!raw) return null;
  try {
    const migrated = raw.replaceAll('"WEEKDAYS"', '"WEEKDAY_OFFICE"');
    if (migrated !== raw) sessionStorage.setItem(DEMO_SETUP_KEY, migrated);
    return JSON.parse(migrated) as DemoSetupRequest;
  } catch {
    sessionStorage.removeItem(DEMO_SETUP_KEY);
    return null;
  }
}

export function useDemoSetup() {
  const router = useRouter();
  const result = useQuery({
    queryKey: demoSetupQueryKey,
    queryFn: readDemoSetup,
    staleTime: Infinity,
  });
  const setup = result.data ?? null;

  useEffect(() => {
    if (result.isSuccess && !setup) router.replace("/demo/setup");
  }, [router, setup, result.isSuccess]);

  return { setup, isPending: result.isPending || !setup };
}
