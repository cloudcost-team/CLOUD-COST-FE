"use client";

import { useState } from "react";
import type {
  ResourceType,
  ResourceWaste,
  ResourceWasteItem,
} from "@/api/waste";
import { PermissionUpgradeNotice } from "@/components/connection/PermissionUpgradeNotice";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { NoticeList } from "@/components/ui/NoticeList";
import { TextButton } from "@/components/ui/TextButton";
import { formatMoney } from "@/lib/formatMoney";
import { formatKstDateTime } from "@/lib/kstDate";

type ResourceFilter = "ALL" | ResourceType;

const RESOURCE_TYPE_OPTIONS: { value: ResourceType; label: string }[] = [
  { value: "INSTANCE", label: "서버" },
  { value: "VOLUME", label: "볼륨" },
  { value: "ADDRESS", label: "고정 IP" },
  { value: "SNAPSHOT", label: "스냅샷" },
  { value: "LOAD_BALANCER", label: "로드밸런서" },
];

const COST_BASIS_NOTES: Record<string, string> = {
  estimated_list_price:
    "금액은 AWS 공개 정가로 계산한 값이라 실제 청구액과 다를 수 있어요.",
};

function ResourceItemCard({
  item,
  currency,
}: {
  item: ResourceWasteItem;
  currency: ResourceWaste["currency"];
}) {
  const [stepsOpen, setStepsOpen] = useState(false);

  return (
    <Card className="gap-gap-medium">
      <div className="flex flex-wrap items-start justify-between gap-gap-large">
        <div className="flex min-w-0 flex-col gap-gap-xsmall">
          <div className="flex flex-wrap items-center gap-gap-small">
            <h3 className="truncate text-title-xsmall text-text-strong">
              {item.name}
            </h3>
            <Badge tone="brand">{item.kindLabel}</Badge>
            <Badge tone={item.otherRegion ? "warning" : "neutral"}>
              {item.otherRegion ? `기본 리전 밖 · ${item.region}` : item.region}
            </Badge>
          </div>
          <p className="text-subtext-small text-text-quaternary">
            {item.resourceTypeLabel} · {item.resourceId}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-gap-xxsmall">
          <p className="text-subtext-small text-text-tertiary">월 비용</p>
          <p className="text-title-small text-text-strong">
            {item.monthlyCost === null
              ? "단가 없음"
              : formatMoney(item.monthlyCost, currency)}
          </p>
        </div>
      </div>
      <dl className="flex flex-col gap-gap-small text-subtext-medium">
        <div className="flex gap-gap-medium">
          <dt className="w-14 shrink-0 text-subtext-small text-text-quaternary">
            탐지 근거
          </dt>
          <dd className="text-text-secondary">{item.evidence}</dd>
        </div>
        <div className="flex gap-gap-medium">
          <dt className="w-14 shrink-0 text-subtext-small text-text-quaternary">
            추천 조치
          </dt>
          <dd className="text-subtext-medium-strong text-text-strong">
            {item.action}
          </dd>
        </div>
      </dl>
      {item.priceNote && (
        <p className="text-subtext-small text-text-quaternary">
          {item.priceNote}
        </p>
      )}
      <TextButton
        tone="brand"
        className="self-start"
        aria-expanded={stepsOpen}
        onClick={() => setStepsOpen((open) => !open)}
      >
        {stepsOpen ? "정리 방법 접기" : "AWS 콘솔에서 정리하는 방법"}
      </TextButton>
      {stepsOpen && (
        <div className="flex flex-col gap-gap-small">
          <ol className="flex flex-col gap-gap-xsmall text-subtext-medium text-text-secondary">
            {item.consoleSteps.map((step, index) => (
              <li key={step} className="flex gap-gap-xsmall">
                <span className="w-5 shrink-0 text-text-brand tabular-nums">
                  {index + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <NoticeList variant="plain" lines={item.cautions} />
        </div>
      )}
    </Card>
  );
}

function ResourceWasteList({ resources }: { resources: ResourceWaste }) {
  const [filter, setFilter] = useState<ResourceFilter>("ALL");

  if (resources.items.length === 0)
    return (
      <EmptyState
        variant="card"
        icon="check-circle"
        title="방치된 리소스를 찾지 못했어요"
        description="모든 리전을 6시간마다 다시 확인해요."
      />
    );

  const items =
    filter === "ALL"
      ? resources.items
      : resources.items.filter((item) => item.resourceType === filter);
  const filters = [
    { value: "ALL", label: `전체 ${resources.findingCount}` },
    ...RESOURCE_TYPE_OPTIONS,
  ] satisfies { value: ResourceFilter; label: string }[];

  return (
    <>
      <FilterChips
        options={filters}
        value={filter}
        onChange={setFilter}
        aria-label="리소스 종류"
      />
      {items.length === 0 ? (
        <EmptyState variant="subtle" title="이 종류에서 찾은 리소스가 없어요" />
      ) : (
        <div className="flex flex-col gap-gap-large">
          {items.map((item) => (
            <ResourceItemCard
              key={item.recommendationId}
              item={item}
              currency={resources.currency}
            />
          ))}
        </div>
      )}
    </>
  );
}

function ResourceWasteBody({ resources }: { resources: ResourceWaste }) {
  const { scan } = resources;
  if (scan.status === "PERMISSION_UPGRADE_REQUIRED")
    return <PermissionUpgradeNotice scan={scan} upgrade={resources.upgrade} />;
  if (scan.status === "FAILED")
    return (
      <Banner
        tone="warning"
        title="방치 리소스를 확인하지 못했어요"
        description={scan.message ?? undefined}
      />
    );
  if (scan.status === "NOT_SCANNED")
    return (
      <EmptyState
        variant="card"
        icon="clock"
        title="아직 방치 리소스를 확인하지 않았어요"
        description="모든 리전을 6시간마다 확인해요. 잠시 뒤 다시 들어와 주세요."
      />
    );
  return <ResourceWasteList resources={resources} />;
}

export function ResourceWasteSection({
  resources,
}: {
  resources: ResourceWaste;
}) {
  const showTotal =
    resources.scan.status === "OK" && resources.items.length > 0;
  const costBasisNote = COST_BASIS_NOTES[resources.costBasis];

  return (
    <section className="flex flex-col gap-gap-large">
      <div className="flex flex-wrap items-end justify-between gap-gap-medium">
        <div className="flex flex-col gap-gap-xxsmall">
          <h2 className="text-title-small text-text-strong">방치 리소스</h2>
          <p className="text-subtext-medium text-text-tertiary">
            연결 안 된 볼륨, 쓰지 않는 고정 IP, 오래된 스냅샷, 요청 없는
            로드밸런서, 기본 리전 밖에서 실행 중인 서버를 찾아요.
          </p>
        </div>
        {resources.scan.scannedAt && (
          <p className="text-subtext-small text-text-quaternary">
            {`마지막 확인 ${formatKstDateTime(resources.scan.scannedAt)} (KST)`}
          </p>
        )}
      </div>
      {resources.refreshing && (
        <Banner
          tone="info"
          title="방치 리소스를 확인 중이에요"
          description="지금은 저장된 결과를 보여 드려요. 확인이 끝나면 자동으로 다시 불러와요."
        />
      )}
      {showTotal && (
        <p className="text-label-small text-text-strong">
          {resources.totalMonthlyCost === null
            ? "단가를 모르는 항목이 있어 합계를 내지 않았어요"
            : `모두 정리하면 매달 ${formatMoney(resources.totalMonthlyCost, resources.currency)} 줄어요`}
        </p>
      )}
      <ResourceWasteBody resources={resources} />
      <NoticeList
        variant="plain"
        lines={[
          ...(showTotal && costBasisNote ? [costBasisNote] : []),
          ...resources.notes,
        ]}
      />
    </section>
  );
}
