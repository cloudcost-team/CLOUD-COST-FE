"use client";

import { Banner } from "@/components/ui/Banner";

export default function DashboardError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <Banner
      title="대시보드를 불러오지 못했어요"
      description="잠시 뒤 다시 시도해 주세요."
      action={{ label: "다시 시도", onClick: reset }}
    />
  );
}
