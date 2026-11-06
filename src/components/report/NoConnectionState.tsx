"use client";

import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";

export function NoConnectionState() {
  const router = useRouter();
  return (
    <EmptyState
      icon="link"
      title="조회할 수 있는 연결이 없어요"
      description="AWS 계정을 연결하고 검증이 끝나면 비용을 볼 수 있어요."
      action={{
        label: "데이터 연결로 가기",
        onClick: () => router.push("/settings/connections"),
      }}
      variant="card"
    />
  );
}
