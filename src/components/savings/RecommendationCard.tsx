"use client";

import type { Currency } from "@/api/costs";
import type { WasteItem } from "./WasteScreen";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { formatMoney } from "@/lib/formatMoney";
import { WasteKindBadge } from "./WasteKindBadge";

type RecommendationCardProps = {
  item: WasteItem;
  currency: Currency;
  onOpenDetail: () => void;
};

export function getSimulatorHref(recommendationId: string) {
  return `/savings/simulator?recommendationId=${encodeURIComponent(recommendationId)}`;
}

function InfoRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName: string;
}) {
  return (
    <div className="flex items-center gap-gap-medium">
      <dt className="w-14 shrink-0 text-subtext-small text-text-quaternary">
        {label}
      </dt>
      <dd className={valueClassName}>{value}</dd>
    </div>
  );
}

export function RecommendationCard({
  item,
  currency,
  onOpenDetail,
}: RecommendationCardProps) {
  const name = item.name ?? item.instanceId;

  return (
    <Card className="relative flex-row flex-wrap items-center gap-gap-xlarge transition-colors hover:border-border-strong">
      <div className="flex min-w-0 flex-1 flex-col gap-gap-small">
        <div className="flex items-center gap-gap-small">
          <h2 className="truncate text-title-small text-text-strong">
            <button
              type="button"
              onClick={onOpenDetail}
              className="cursor-pointer rounded-xsmall text-left before:absolute before:inset-0 before:rounded-xlarge before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand"
            >
              {name}
            </button>
          </h2>
          <WasteKindBadge kind={item.kind} kindLabel={item.kindLabel} />
        </div>
        <dl className="flex flex-col gap-gap-small">
          <InfoRow
            label="탐지 근거"
            value={item.evidence}
            valueClassName="text-subtext-medium text-text-secondary"
          />
          <InfoRow
            label="추천 조치"
            value={item.action}
            valueClassName="text-subtext-medium-strong text-text-strong"
          />
          <InfoRow
            label="추천 이유"
            value={item.reason}
            valueClassName="text-subtext-small text-text-tertiary"
          />
        </dl>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-gap-xxsmall whitespace-nowrap">
        <p className="text-subtext-small text-text-tertiary">
          월 추정 비용 {formatMoney(item.estimatedMonthlyCost, currency)}
        </p>
        <p className="text-title-medium text-text-brand">
          {formatMoney(item.estimatedMonthlySavings, currency)}
        </p>
        <p className="text-subtext-small text-text-quaternary">
          매달 절감 예상 (추정)
        </p>
      </div>
      <ButtonLink
        variant="secondary"
        size="medium"
        href={getSimulatorHref(item.recommendationId)}
      >
        시뮬레이터에서 효과 보기
      </ButtonLink>
    </Card>
  );
}
