import type { ReactNode } from "react";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Skeleton } from "@/components/ui/Skeleton";

export type DashboardState =
  | "ready"
  | "first-collection"
  | "loading"
  | "empty"
  | "connection-error"
  | "partial"
  | "throttled";

export function DashboardStateContent({
  state,
}: {
  state: Exclude<DashboardState, "ready">;
}): ReactNode {
  if (state === "first-collection")
    return (
      <LoadingState
        title="첫 비용 기록을 모으고 있어요"
        description="연결 직후에는 보통 몇 분 걸려요. 이 화면을 닫아도 수집은 계속돼요."
        className="min-h-96"
      />
    );
  if (state === "loading")
    return (
      <div className="flex flex-col gap-spacing-medium">
        <Skeleton shape="title" />
        <div className="grid gap-gap-large md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((key) => (
            <Skeleton key={key} shape="block" className="h-28 w-full" />
          ))}
        </div>
        <Card>
          <Skeleton shape="title" />
          <Skeleton shape="block" className="h-64 w-full" />
        </Card>
        <Card>
          <Skeleton shape="title" />
          <Skeleton shape="block" className="h-48 w-full" />
          <Skeleton shape="text" />
        </Card>
      </div>
    );
  if (state === "empty")
    return (
      <EmptyState
        variant="card"
        icon="calendar"
        title="이 기간에는 사용 기록이 없어요"
        description="기록을 모으기 시작한 날짜 이후로 기간을 바꿔 주세요."
      />
    );
  if (state === "connection-error")
    return (
      <Banner
        title="AWS 연결을 확인해 주세요"
        description="저장된 기록은 볼 수 있지만 새 데이터는 가져오지 못하고 있어요."
        action={{ label: "연결 상세 보기", onClick: () => undefined }}
      />
    );
  if (state === "partial")
    return (
      <Banner
        tone="warning"
        title="일부 데이터만 수집했어요"
        description="받은 범위는 먼저 보여 드리고, 빠진 구간은 다음 수집에서 다시 시도해요."
      />
    );
  return (
    <Banner
      tone="warning"
      title="AWS 요청이 잠시 제한됐어요"
      description="저장된 데이터를 보여 드리고 있어요. 잠시 뒤 다시 시도해 주세요."
      action={{ label: "다시 시도", onClick: () => undefined }}
    />
  );
}
