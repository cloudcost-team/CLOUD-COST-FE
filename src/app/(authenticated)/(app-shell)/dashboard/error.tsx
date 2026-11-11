"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Banner } from "@/components/ui/Banner";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Banner
      title="대시보드를 불러오지 못했어요"
      description="잠시 뒤 다시 시도해 주세요."
      action={{ label: "다시 시도", onClick: reset }}
    />
  );
}
