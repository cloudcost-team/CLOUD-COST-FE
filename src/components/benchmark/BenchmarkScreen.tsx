"use client";

import { useState, type ReactNode } from "react";
import type {
  BenchmarkMonthlySpend,
  BenchmarkOversizedRatio,
  BenchmarkResponse,
  BenchmarkSpendPosition,
} from "@/api/benchmark";
import type { Currency } from "@/api/costs";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { NoticeList } from "@/components/ui/NoticeList";
import { Panel } from "@/components/ui/Panel";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatMoney } from "@/lib/formatMoney";
import { formatKoreanMonthDay } from "@/lib/kstDate";
import { BenchmarkMetricCard } from "./BenchmarkMetricCard";
import { formatPercent } from "./benchmarkFormat";
import { DistributionChart, type DistributionBars } from "./DistributionChart";
import { OversizedRatioDetailPanel } from "./OversizedRatioDetailPanel";
import { RangeBar, type SpendScale } from "./RangeBar";
import { UnavailableMetricCard } from "./UnavailableMetricCard";

type BenchmarkView = "current" | "after";

type BenchmarkScreenProps = {
  data: BenchmarkResponse | undefined;
  isPending: boolean;
  distribution: DistributionBars;
  spendScale: SpendScale;
  selectedMonthlySavings: number | null;
};

const viewOptions: { value: BenchmarkView; label: string }[] = [
  { value: "current", label: "현재" },
  { value: "after", label: "시뮬레이션 적용 후" },
];

const SPEND_TEAM_LABEL = "1~10명 팀";

const positionSentence: Record<BenchmarkSpendPosition, string> = {
  BELOW: `${SPEND_TEAM_LABEL} 일반 범위보다 적게 쓰고 있어요`,
  WITHIN: `${SPEND_TEAM_LABEL} 일반 범위 안에 있어요`,
  ABOVE: `${SPEND_TEAM_LABEL} 일반 범위보다 많이 쓰고 있어요`,
};

function StateCard({ children }: { children: ReactNode }) {
  return <Card className="items-center">{children}</Card>;
}

function OversizedRatioSection({
  oversizedRatio,
  availableAt,
  distribution,
  showAfter,
}: {
  oversizedRatio: BenchmarkOversizedRatio;
  availableAt: string | null;
  distribution: DistributionBars;
  showAfter: boolean;
}) {
  const [detailOpen, setDetailOpen] = useState(false);
  const { status, ours, reference, moreEfficientTeamsPercent } = oversizedRatio;

  if (status === "INSUFFICIENT_HISTORY")
    return (
      <StateCard>
        <EmptyState
          icon="clock"
          title="아직 비교하기엔 기록이 짧아요"
          description={
            availableAt
              ? `${formatKoreanMonthDay(availableAt)}부터 비교해 드려요.`
              : undefined
          }
          className="w-140 max-w-full"
        />
      </StateCard>
    );

  if (status === "NOT_COMPARABLE")
    return (
      <StateCard>
        <EmptyState
          icon="bar-chart"
          title={
            ours
              ? `서버가 ${ours.judgedCount}대라 비교하기 어려워요`
              : "비교하기 어려워요"
          }
          description="비교 데이터가 서버 3~20대를 쓰는 팀 기준이라, 지금은 ① 지표를 보여 드리지 않아요. ③ 월 지출 비교는 볼 수 있어요."
          className="w-140 max-w-full"
        />
      </StateCard>
    );

  const after = showAfter ? oversizedRatio.afterSimulation : null;
  const sampleSize = reference.sampleSize.toLocaleString("ko-KR");
  const current = formatPercent(ours?.ratio ?? null);

  return (
    <>
      <BenchmarkMetricCard
        title="① 컴퓨팅 과다 사양 비율"
        description="CPU 사용률(P95) 10% 미만 서버의 비중"
        value={after ? `${current} → ${formatPercent(after.ratio)}` : current}
        comparison={
          moreEfficientTeamsPercent === null
            ? null
            : `소규모 팀 ${sampleSize}곳 중 우리보다 효율적인 팀 ${moreEfficientTeamsPercent}%`
        }
        source={`비교 기준: ${reference.source} · ${reference.sizeBandLabel} 구독 ${sampleSize}곳 (평균 ${formatPercent(reference.averageRatio)}, 중앙값 ${formatPercent(reference.medianRatio)})`}
        chart={<DistributionChart bars={distribution} showAfter={showAfter} />}
        onOpenDetail={() => setDetailOpen(true)}
      />
      <OversizedRatioDetailPanel
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        oversizedRatio={oversizedRatio}
      />
    </>
  );
}

function MonthlySpendSection({
  monthlySpend,
  currency,
  spendScale,
  showAfter,
}: {
  monthlySpend: BenchmarkMonthlySpend;
  currency: Currency;
  spendScale: SpendScale;
  showAfter: boolean;
}) {
  const { range } = monthlySpend;
  const rangeLabel = `$${range.minUsd}~$${range.maxUsd}`;
  const source = `비교 기준: ${range.source} · ${SPEND_TEAM_LABEL} 일반 범위 ${rangeLabel}`;

  if (
    monthlySpend.status === "NO_FORECAST" ||
    monthlySpend.monthlyCost === null ||
    monthlySpend.position === null
  )
    return (
      <UnavailableMetricCard
        title="③ 규모 대비 월 지출"
        reason="이번 달 월말 예상 비용이 없어 비교하지 않았어요."
        source={source}
      />
    );

  const after = showAfter ? monthlySpend.afterSimulation : null;
  const current = formatMoney(monthlySpend.monthlyCost, currency);

  return (
    <BenchmarkMetricCard
      title="③ 규모 대비 월 지출"
      description="월 클라우드 지출 (추정)"
      value={
        after
          ? `${current} → ${formatMoney(after.monthlyCost, currency)}`
          : current
      }
      comparison={positionSentence[after?.position ?? monthlySpend.position]}
      source={source}
      chart={
        <RangeBar
          scale={spendScale}
          rangeLabel={`일반 범위 ${rangeLabel}`}
          showAfter={Boolean(after)}
        />
      }
    />
  );
}

function BenchmarkToolbar({
  view,
  onViewChange,
  appliedCount,
  selectedMonthlySavings,
  currency,
}: {
  view: BenchmarkView;
  onViewChange: (view: BenchmarkView) => void;
  appliedCount: number;
  selectedMonthlySavings: number | null;
  currency: Currency;
}) {
  return (
    <div className="flex flex-wrap items-center gap-gap-medium">
      <SegmentedControl
        aria-label="비교 기준"
        options={viewOptions}
        value={view}
        onChange={onViewChange}
      />
      {view === "after" && appliedCount > 0 ? (
        <Panel
          variant="brand"
          className="flex items-center gap-gap-medium py-padding-xsmall pr-padding-xsmall pl-padding-medium"
        >
          <p className="text-subtext-medium text-text-secondary">
            비용 시뮬레이터에서 고른 변경 {appliedCount}건
            {selectedMonthlySavings !== null &&
              `(월 ${formatMoney(selectedMonthlySavings, currency)} 절감)`}
            을 적용했을 때 기준이에요
          </p>
          <ButtonLink
            variant="secondary"
            size="small"
            href="/savings/simulator"
          >
            변경 다시 고르기
          </ButtonLink>
        </Panel>
      ) : (
        <p className="text-subtext-small text-text-quaternary">
          적용 후 위치는 비용 시뮬레이터에서 고른 변경 기준이에요
        </p>
      )}
    </div>
  );
}

function BenchmarkBody({
  data,
  view,
  distribution,
  spendScale,
}: {
  data: BenchmarkResponse;
  view: BenchmarkView;
  distribution: DistributionBars;
  spendScale: SpendScale;
}) {
  const showAfter = view === "after";
  const { wasteRatio } = data;
  const notes = [...data.freshness.warnings, ...data.notes];

  if (showAfter && data.appliedRecommendationIds.length === 0)
    return (
      <StateCard>
        <EmptyState
          icon="sliders"
          title="시뮬레이터에서 변경을 먼저 골라 주세요"
          description="고른 변경이 있어야 적용 후 이동할 위치를 보여 드릴 수 있어요."
          action={{
            label: "비용 시뮬레이터로 가기",
            href: "/savings/simulator",
          }}
          className="w-140 max-w-full"
        />
      </StateCard>
    );

  return (
    <>
      <OversizedRatioSection
        oversizedRatio={data.oversizedRatio}
        availableAt={data.availableAt}
        distribution={distribution}
        showAfter={showAfter}
      />
      <UnavailableMetricCard
        title="② 전체 낭비 비율"
        badge="준비 중"
        reason={wasteRatio.reason}
        source={`비교 기준: ${wasteRatio.referenceSource} 업계 평균 ${wasteRatio.referenceAverage}%`}
      />
      <MonthlySpendSection
        monthlySpend={data.monthlySpend}
        currency={data.currency}
        spendScale={spendScale}
        showAfter={showAfter}
      />
      <NoticeList variant="plain" lines={notes} />
    </>
  );
}

export function BenchmarkScreen({
  data,
  isPending,
  distribution,
  spendScale,
  selectedMonthlySavings,
}: BenchmarkScreenProps) {
  const [view, setView] = useState<BenchmarkView>("current");

  if (isPending || !data)
    return (
      <div className="flex flex-col gap-spacing-medium">
        <PageHeader title="팀 벤치마킹" />
        <div className="flex flex-col gap-gap-medium">
          <Skeleton shape="block" className="h-35 w-full" />
          <Skeleton shape="block" className="h-35 w-full" />
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-spacing-medium">
      <PageHeader
        title="팀 벤치마킹"
        description="비슷한 규모 팀과 비교해 우리 팀의 비용 효율을 봐요."
      />
      <BenchmarkToolbar
        view={view}
        onViewChange={setView}
        appliedCount={data.appliedRecommendationIds.length}
        selectedMonthlySavings={selectedMonthlySavings}
        currency={data.currency}
      />
      <BenchmarkBody
        data={data}
        view={view}
        distribution={distribution}
        spendScale={spendScale}
      />
    </div>
  );
}
