import type { ReactNode } from "react";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Panel";
import { TextLink } from "@/components/ui/TextLink";
import { Skeleton } from "@/components/ui/Skeleton";

export type DashboardState =
  | "ready"
  | "no-instances"
  | "loading"
  | "empty"
  | "connection-error"
  | "partial"
  | "throttled";

type DashboardStateContentProps = {
  state: Exclude<DashboardState, "ready">;
  region?: string;
  regionLabel?: string;
  onRetry?: () => void;
};

function InstanceLaunchGuide({
  region,
  regionLabel,
}: {
  region?: string;
  regionLabel?: string;
}) {
  const steps = [
    `AWS 콘솔 오른쪽 위에서 리전이 ${regionLabel ?? "연결한 리전"}인지 확인하고 EC2 → 인스턴스 시작으로 가요.`,
    "이름을 입력하고, OS 이미지는 기본값(Amazon Linux)을 그대로 둬요.",
    "인스턴스 유형은 '프리 티어 사용 가능' 표시가 있는 유형(t3.micro 등)을 골라요.",
    "키 페어는 '키 페어 없이 계속 진행'을 고르고 인스턴스 시작을 눌러요.",
  ];
  return (
    <Panel
      variant="subtle"
      size="medium"
      className="flex flex-col gap-gap-medium text-left"
    >
      <p className="text-title-xsmall text-text-strong">
        EC2 인스턴스를 가장 간단하게 만드는 방법
      </p>
      <ol className="flex flex-col gap-gap-xsmall text-body-xsmall text-text-secondary">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-gap-xsmall">
            <span className="w-5 shrink-0 text-text-brand tabular-nums">
              {index + 1}.
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      {region && (
        <TextLink
          href={`https://${region}.console.aws.amazon.com/ec2/home?region=${region}#LaunchInstances:`}
          target="_blank"
          rel="noreferrer"
          icon="external-link"
          className="self-start"
        >
          AWS 콘솔에서 인스턴스 시작 열기
        </TextLink>
      )}
    </Panel>
  );
}

export function DashboardStateContent({
  state,
  region,
  regionLabel,
  onRetry,
}: DashboardStateContentProps): ReactNode {
  if (state === "no-instances")
    return (
      <Card>
        <EmptyState
          icon="grid"
          title="이 리전에 EC2 인스턴스가 없어요"
          description={`연결한 계정의 ${regionLabel ?? "선택한"} 리전에서 인스턴스를 찾지 못했어요. 다른 리전에서 쓰고 있다면 그 리전으로 다시 연결해 주세요.`}
          action={{
            label: "데이터 연결로 가기",
            href: "/settings/connections",
          }}
        />
        <InstanceLaunchGuide region={region} regionLabel={regionLabel} />
      </Card>
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
        action={onRetry && { label: "다시 시도", onClick: onRetry }}
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
      action={onRetry && { label: "다시 시도", onClick: onRetry }}
    />
  );
}
