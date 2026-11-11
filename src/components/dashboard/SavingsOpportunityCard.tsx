"use client";

import type { DataSource } from "@/api/dataSource";
import { useWaste } from "@/hooks/useWaste";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { useAppMode, useAppPath } from "@/hooks/useAppMode";
import { formatMoney } from "@/lib/formatMoney";

type SavingsOpportunityCardProps = {
  source: DataSource;
};

export function SavingsOpportunityCard({
  source,
}: SavingsOpportunityCardProps) {
  const { demo } = useAppMode();
  const appPath = useAppPath();
  const { data } = useWaste(source);

  if (!data || data.status !== "OK" || data.totalMonthlySavings <= 0)
    return null;

  const caption = [
    data.savingsRateOfForecast !== null &&
      `현재 설정 기준으로 월말 예상 비용 대비 ${data.savingsRateOfForecast}% 절감 가능해요`,
    data.counts.oversized > 0 && `과다 사양 ${data.counts.oversized}대`,
    data.counts.idle > 0 && `유휴 ${data.counts.idle}대`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="flex flex-wrap items-center justify-between gap-gap-large rounded-xlarge border border-border-brand bg-fill-brand-weak p-padding-large">
      <div className="flex min-w-0 flex-col gap-gap-xsmall">
        <div className="flex items-center gap-gap-xsmall">
          <Icon name="trending-down" className="text-icon-brand" />
          <p className="text-label-small text-text-brand">
            최적화하면 다음달 비용을 더 줄일 수 있어요
          </p>
        </div>
        <p className="text-display-small text-text-strong">
          월 {formatMoney(data.totalMonthlySavings, data.currency)} 절감 예상
        </p>
        <p className="text-subtext-medium text-text-secondary">{caption}</p>
      </div>
      {!demo && (
        <ButtonLink
          size="medium"
          icon="arrow-right"
          href={appPath("/savings/waste")}
        >
          줄일 서버 {data.findingCount}건 보기
        </ButtonLink>
      )}
    </section>
  );
}
