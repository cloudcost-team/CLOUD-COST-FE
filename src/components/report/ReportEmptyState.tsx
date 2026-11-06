"use client";

import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";

const DESCRIPTIONS = {
  noRecord:
    "기록이 쌓이면 이번 달 미리 보기부터 보여 드려요. 확정 리포트는 매달 1일에 만들어져요.",
  emptyMonth:
    "이 달에는 사용 기록이 없어요. 0원을 쓴 게 아니라 기록이 없는 달이에요.",
};

export function ReportEmptyState({
  reason,
}: {
  reason: keyof typeof DESCRIPTIONS;
}) {
  const router = useRouter();
  return (
    <EmptyState
      icon="file-text"
      title="아직 리포트가 없어요"
      description={DESCRIPTIONS[reason]}
      action={{
        label: "대시보드로 가기",
        onClick: () => router.push("/dashboard"),
      }}
      variant="card"
    />
  );
}
