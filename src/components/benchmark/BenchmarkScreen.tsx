"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState, type CSSProperties, type ReactNode } from "react";
import { benchmarkKeys, getBenchmark } from "@/api/benchmark";
import type { Currency } from "@/api/costs";
import { getSourceId, type DataSource } from "@/api/dataSource";
import type { ExchangeRate } from "@/api/reports";
import { DataSourceGate } from "@/components/layout/DataSourceGate";
import { PageHeader } from "@/components/layout/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { NoticeList } from "@/components/ui/NoticeList";
import { Panel } from "@/components/ui/Panel";
import { Popover } from "@/components/ui/Popover";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Skeleton } from "@/components/ui/Skeleton";
import { TextButton } from "@/components/ui/TextButton";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/formatMoney";
import { useAppMode, useAppPath } from "@/hooks/useAppMode";
import { formatKoreanMonthDay } from "@/lib/kstDate";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useSimulationSelectionStore } from "@/stores/simulationSelectionStore";
import { BenchmarkMetricCard } from "./BenchmarkMetricCard";
import { formatPercent } from "./benchmarkFormat";
import { DistributionChart } from "./DistributionChart";
import { OursMarker } from "./OursMarker";
import { OversizedRatioDetailPanel } from "./OversizedRatioDetailPanel";
import { RangeBar } from "./RangeBar";
import { UnavailableMetricCard } from "./UnavailableMetricCard";

export type BenchmarkServer = {
  instanceId: string;
  name: string | null;
  instanceType: string | null;
  cpuP95: number;
  cpuHours: number;
  oversized: boolean;
  verdict: string;
};

export type BenchmarkRatio = {
  judgedCount: number;
  oversizedCount: number;
  ratio: number | null;
};

export type BenchmarkOversizedReference = {
  source: string;
  description: string;
  sizeBand: string | null;
  sizeBandLabel: string | null;
  dataAvailable: boolean;
  sampleSize: number;
  averageRatio: number | null;
  medianRatio: number | null;
  percentileAvailable: boolean;
};

export type BenchmarkSizeBand = {
  key: string;
  label: string;
  minServers: number;
  maxServers: number;
  dataAvailable: boolean;
  matchesOurs: boolean;
};

export type BenchmarkDistributionBucket = {
  fromPercent: number;
  toPercent: number;
  label: string;
  teamsPercent: number;
  ours: boolean;
  afterSimulation: boolean;
};

export type BenchmarkDistribution = {
  approximate: boolean;
  basis: string;
  sizeBand: string;
  buckets: BenchmarkDistributionBucket[];
  oursBucketIndex: number | null;
  afterSimulationBucketIndex: number | null;
};

export type BenchmarkOversizedRatio = {
  status: "OK" | "NOT_COMPARABLE" | "INSUFFICIENT_HISTORY";
  ours: BenchmarkRatio | null;
  moreEfficientTeamsPercent: number | null;
  matchedSizeBand: string | null;
  reference: BenchmarkOversizedReference;
  sizeBands: BenchmarkSizeBand[];
  distribution: BenchmarkDistribution | null;
  servers: BenchmarkServer[];
  afterSimulation: BenchmarkRatio | null;
};

export type BenchmarkWasteRatioStatus =
  | "OK"
  | "UNAVAILABLE"
  | "INSUFFICIENT_HISTORY"
  | "NO_FORECAST"
  | "NOT_COMPARABLE";

export type BenchmarkWasteComparison = "BELOW" | "SAME" | "ABOVE";

export type BenchmarkWasteAmounts = {
  serverWaste: number;
  resourceWaste: number;
  waste: number;
  total: number;
  wasteUsd: number;
  totalUsd: number;
};

export type BenchmarkWasteRatio = {
  status: BenchmarkWasteRatioStatus;
  reason: string | null;
  ratioPercent: number | null;
  comparison: BenchmarkWasteComparison | null;
  amounts: BenchmarkWasteAmounts | null;
  afterSimulationRatioPercent: number | null;
  referenceSource: string;
  referenceDescription: string;
  referenceAverage: number;
};

export type BenchmarkSpendPosition = "BELOW" | "WITHIN" | "ABOVE";

export type BenchmarkSpendModel = {
  method: "QUANTILE_REGRESSION";
  sampleSize: number;
  minServers: number;
  maxServers: number;
  testSize: number;
  improvementPercent: number;
  middleHalfCoveragePercent: number;
};

export type BenchmarkSpendRange = {
  source: string;
  description: string;
  servers: number;
  label: string;
  min: number;
  max: number;
  minUsd: number;
  maxUsd: number;
  minVcpuHours: number;
  maxVcpuHours: number;
  medianVcpuHours: number;
  model: BenchmarkSpendModel;
};

export type BenchmarkMonthlySpendStatus =
  "OK" | "NO_FORECAST" | "INSUFFICIENT_HISTORY" | "NOT_COMPARABLE";

export type BenchmarkMonthlySpend = {
  status: "OK" | "NO_FORECAST" | "INSUFFICIENT_HISTORY" | "NOT_COMPARABLE";
  monthlyCost: number | null;
  monthlyCostUsd: number | null;
  monthlyVcpuHours: number | null;
  servers: number | null;
  teamsUsingLessPercent: number | null;
  position: BenchmarkSpendPosition | null;
  barPositionPercent: number | null;
  range: BenchmarkSpendRange | null;
  afterSimulation: {
    monthlyCost: number;
    monthlyCostUsd: number;
    position: BenchmarkSpendPosition;
    barPositionPercent: number;
  } | null;
};

export type BenchmarkFreshness = {
  instancesRefreshedAt: string | null;
  instancesFromCache: boolean;
  usageRefreshedAt: string | null;
  usageFromCache: boolean;
  nextUsageRefreshAt: string | null;
  warnings: string[];
  warningDetails?: { code: string; message: string }[];
};

export type BenchmarkResponse = {
  dataSource: "aws" | "demo";
  costBasis: "estimated_on_demand";
  currency: Currency;
  exchangeRate: ExchangeRate | null;
  accountId: string | null;
  status: "OK" | "INSUFFICIENT_HISTORY";
  availableAt: string | null;
  window: { from: string; to: string };
  appliedRecommendationIds: string[];
  selectedMonthlySavings: number | null;
  oversizedRatio: BenchmarkOversizedRatio;
  wasteRatio: BenchmarkWasteRatio;
  monthlySpend: BenchmarkMonthlySpend;
  freshness: BenchmarkFreshness;
  notes: string[];
  asOf: string;
};

type BenchmarkView = "current" | "after";

function percentStatus(percent: number | null) {
  if (percent === null || !Number.isFinite(percent)) return undefined;
  // 30%와 70%는 다음 구간에 포함해 경계값이 겹치지 않게 한다.
  return percent < 30 ? "good" : percent < 70 ? "medium" : "risk";
}

const viewOptions: { value: BenchmarkView; label: string }[] = [
  { value: "current", label: "현재" },
  { value: "after", label: "시뮬레이션 적용 후" },
];

const SPEND_SOURCE = "Azure Public Dataset V2";

const positionSentence: Record<BenchmarkSpendPosition, string> = {
  BELOW: "일반 범위 아래",
  WITHIN: "일반 범위 안",
  ABOVE: "일반 범위 위",
};

function spendRankLabel(teamsUsingLessPercent: number) {
  return `사용량 상위 ${Math.max(100 - teamsUsingLessPercent, 5)}%`;
}

function spendUnavailableReason(
  monthlySpend: BenchmarkMonthlySpend,
  availableAt: string | null,
) {
  if (monthlySpend.status === "INSUFFICIENT_HISTORY")
    return availableAt
      ? `기록이 14일 미만이라 ${formatKoreanMonthDay(availableAt)}부터 같은 규모 팀과 비교해 드려요.`
      : "기록이 14일 미만이라 아직 같은 규모 팀과 비교하지 않았어요.";
  if (monthlySpend.status === "NOT_COMPARABLE")
    return monthlySpend.servers
      ? `비교 모델은 서버 50대까지 학습해 서버 ${monthlySpend.servers}대는 비교하지 않았어요.`
      : "최근 14일 동안 켜진 서버가 없어 비교하지 않았어요.";
  return "이번 달 월말 예상 비용이 없어 비교하지 않았어요.";
}

function StateCard({ children }: { children: ReactNode }) {
  return <Card className="items-center">{children}</Card>;
}

function OversizedRatioSection({
  oversizedRatio,
  availableAt,
  showAfter,
}: {
  oversizedRatio: BenchmarkOversizedRatio;
  availableAt: string | null;
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
        title="① 컴퓨팅 리소스 활용도"
        description="CPU 사용률(P95) 10% 미만 서버의 비중"
        value={after ? `${current} → ${formatPercent(after.ratio)}` : current}
        status={percentStatus(after?.ratio ?? ours?.ratio ?? null)}
        comparison={
          moreEfficientTeamsPercent === null
            ? null
            : `비교 대상 팀의 ${moreEfficientTeamsPercent}%가 우리보다 리소스를 효율적으로 사용해요`
        }
        source={`비교 기준: ${reference.source} · ${reference.sizeBandLabel} 구독 ${sampleSize}곳 (평균 ${formatPercent(reference.averageRatio)}, 중앙값 ${formatPercent(reference.medianRatio)})`}
        chart={
          oversizedRatio.distribution && (
            <DistributionChart
              bars={{
                values: oversizedRatio.distribution.buckets.map(
                  (bucket) => bucket.teamsPercent,
                ),
                oursIndex: oversizedRatio.distribution.oursBucketIndex,
                afterIndex:
                  oversizedRatio.distribution.afterSimulationBucketIndex,
              }}
              showAfter={Boolean(after)}
            />
          )
        }
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
  showAfter,
  availableAt,
}: {
  monthlySpend: BenchmarkMonthlySpend;
  currency: Currency;
  showAfter: boolean;
  availableAt: string | null;
}) {
  const { range } = monthlySpend;

  if (
    monthlySpend.status !== "OK" ||
    range === null ||
    monthlySpend.monthlyCost === null ||
    monthlySpend.position === null ||
    monthlySpend.barPositionPercent === null ||
    monthlySpend.teamsUsingLessPercent === null
  )
    return (
      <UnavailableMetricCard
        title="③ 규모 대비 월 지출"
        reason={spendUnavailableReason(monthlySpend, availableAt)}
        source={`비교 기준: ${SPEND_SOURCE} · 서버 대수별 한 달 사용량 (참고용)`}
      />
    );

  const startLabel = formatMoney(range.min, currency);
  const endLabel = formatMoney(range.max, currency);
  const sampleSize = range.model.sampleSize.toLocaleString("ko-KR");
  const after = showAfter ? monthlySpend.afterSimulation : null;
  const current = formatMoney(monthlySpend.monthlyCost, currency);

  return (
    <BenchmarkMetricCard
      title="③ 규모 대비 월 지출"
      description="월말 예상 클라우드 지출"
      value={
        after
          ? `${current} → ${formatMoney(after.monthlyCost, currency)}`
          : current
      }
      status={
        (after?.position ?? monthlySpend.position) === "BELOW"
          ? "good"
          : (after?.position ?? monthlySpend.position) === "WITHIN"
            ? "medium"
            : "risk"
      }
      comparison={`${range.label} 팀 중 ${spendRankLabel(monthlySpend.teamsUsingLessPercent)} · ${positionSentence[after?.position ?? monthlySpend.position]}`}
      source={`비교 기준: ${range.source} 구독 ${sampleSize}곳으로 학습한 분위 회귀 모델 (검증 오차 ${range.model.improvementPercent}% 개선 · 참고용)`}
      chart={
        <RangeBar
          position={after?.position ?? monthlySpend.position}
          barPositionPercent={
            after?.barPositionPercent ?? monthlySpend.barPositionPercent
          }
          markerLabel={
            after
              ? `적용 후 ${formatMoney(after.monthlyCost, currency)}`
              : `우리 팀 ${current}`
          }
          startLabel={startLabel}
          endLabel={endLabel}
          caption={`같은 규모 팀만큼 쓰면 월 ${startLabel}~${endLabel}`}
        />
      }
    />
  );
}

const wasteComparisonSentence: Record<BenchmarkWasteComparison, string> = {
  BELOW: "보다 낮아요",
  SAME: "과 비슷해요",
  ABOVE: "보다 높아요",
};

function WasteAmountRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap gap-x-gap-medium gap-y-gap-xxsmall">
      <dt className="w-24 shrink-0 text-subtext-small text-text-quaternary">
        {label}
      </dt>
      <dd className="text-subtext-medium text-text-secondary">{value}</dd>
    </div>
  );
}

function WasteRatioBar({
  ours,
  after,
  average,
}: {
  ours: number;
  after: number | null;
  average: number;
}) {
  const shown = after ?? ours;
  const overAverage = shown > average;
  return (
    <div
      className="flex min-w-0 flex-col gap-gap-small"
      style={
        { "--shown": `${shown}%`, "--average": `${average}%` } as CSSProperties
      }
    >
      <div className="flex flex-col">
        <OursMarker
          position={shown}
          label={after === null ? "우리 팀" : "적용 후"}
        />
        <div
          role="img"
          aria-label={`우리 팀 ${shown}%, 업계 평균 ${average}%`}
          className="relative h-4 overflow-hidden rounded-full bg-fill-neutral-weak"
        >
          <div
            className={cn(
              "absolute inset-y-0 left-0 bg-fill-brand",
              overAverage ? "w-(--average)" : "w-(--shown)",
            )}
          />
          {overAverage && (
            <div className="absolute inset-y-0 right-[calc(100%-var(--shown))] left-(--average) bg-fill-warning" />
          )}
          <span className="absolute inset-y-0 left-(--average) w-0 border-l-2 border-dashed border-fill-default" />
        </div>
      </div>
      <div className="relative h-5 text-subtext-small text-text-tertiary">
        <span className="absolute left-0">0%</span>
        <span className="absolute left-(--average) -translate-x-1/2 whitespace-nowrap text-text-brand">
          업계 평균 {average}%
        </span>
        <span className="absolute right-0">100%</span>
      </div>
      {overAverage && (
        <p className="flex items-center gap-gap-xsmall text-subtext-medium text-text-secondary">
          <span aria-hidden className="size-2.5 rounded-full bg-fill-warning" />
          업계 평균보다 더 낭비하는 부분
        </p>
      )}
    </div>
  );
}

function WasteRatioSection({
  wasteRatio,
  currency,
  showAfter,
}: {
  wasteRatio: BenchmarkWasteRatio;
  currency: Currency;
  showAfter: boolean;
}) {
  const { referenceAverage, ratioPercent, comparison, amounts } = wasteRatio;
  const source = `비교 기준: ${wasteRatio.referenceSource} (기업이 답한 클라우드 지출 중 낭비 비율 평균)`;

  if (
    wasteRatio.status !== "OK" ||
    ratioPercent === null ||
    comparison === null ||
    amounts === null
  )
    return (
      <UnavailableMetricCard
        title="② 비용 절감 가능 비율"
        reason={
          wasteRatio.reason ?? "지금은 전체 낭비 비율을 계산할 수 없어요."
        }
        source={source}
      />
    );

  const after = showAfter ? wasteRatio.afterSimulationRatioPercent : null;

  return (
    <BenchmarkMetricCard
      title="② 비용 절감 가능 비율"
      description="매달 쓰는 비용 중 줄일 수 있는 비용의 비율"
      value={
        after === null ? `${ratioPercent}%` : `${ratioPercent}% → ${after}%`
      }
      status={percentStatus(after ?? ratioPercent)}
      comparison={`절감 가능 비율이 업계 평균(${referenceAverage}%)${wasteComparisonSentence[comparison]}`}
      source={source}
      chart={
        <div className="flex flex-col gap-gap-medium">
          <WasteRatioBar
            ours={ratioPercent}
            after={after}
            average={referenceAverage}
          />
          <dl className="flex flex-col gap-gap-xsmall">
            <WasteAmountRow
              label="줄일 수 있는 비용"
              value={`월 ${formatMoney(amounts.waste, currency)} (서버 사양·유휴 ${formatMoney(amounts.serverWaste, currency)} · 방치 리소스 ${formatMoney(amounts.resourceWaste, currency)})`}
            />
            <WasteAmountRow
              label="전체 비용"
              value={`월 ${formatMoney(amounts.total, currency)} (월말 예상 + 방치 리소스)`}
            />
          </dl>
        </div>
      }
    />
  );
}

function BenchmarkNotes({ notes }: { notes: string[] }) {
  const [open, setOpen] = useState(false);
  if (notes.length === 0) return null;
  return (
    <div className="ml-auto">
      <Popover
        open={open}
        onOpenChange={setOpen}
        title="계산 방법과 참고 사항"
        align="end"
        className="max-h-96 w-140 overflow-y-auto"
        trigger={(props) => (
          <TextButton
            {...props}
            icon="info"
            className="flex text-subtext-small text-text-tertiary"
          >
            계산 방법
          </TextButton>
        )}
      >
        <NoticeList variant="plain" lines={notes} />
      </Popover>
    </div>
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
  const appPath = useAppPath();
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
          className="flex items-center gap-gap-medium py-padding-xxsmall pr-padding-xxsmall pl-padding-medium"
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
            href={appPath("/savings/simulator")}
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
}: {
  data: BenchmarkResponse;
  view: BenchmarkView;
}) {
  const appPath = useAppPath();
  const showAfter = view === "after";
  const { wasteRatio } = data;

  if (showAfter && data.appliedRecommendationIds.length === 0)
    return (
      <StateCard>
        <EmptyState
          icon="sliders"
          title="시뮬레이터에서 변경을 먼저 골라 주세요"
          description="고른 변경이 있어야 적용 후 이동할 위치를 보여 드릴 수 있어요."
          action={{
            label: "비용 시뮬레이터로 가기",
            href: appPath("/savings/simulator"),
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
        showAfter={showAfter}
      />
      <WasteRatioSection
        wasteRatio={wasteRatio}
        currency={data.currency}
        showAfter={showAfter}
      />
      <MonthlySpendSection
        monthlySpend={data.monthlySpend}
        currency={data.currency}
        showAfter={showAfter}
        availableAt={data.availableAt}
      />
      <NoticeList variant="plain" lines={data.freshness.warnings} />
    </>
  );
}

function BenchmarkContent({ source }: { source: DataSource }) {
  const { demo } = useAppMode();
  const accountId = getSourceId(source);
  const currency = useCurrencyStore((state) => state.currency);
  const selection = useSimulationSelectionStore((state) =>
    state.selection?.accountId === accountId ? state.selection : null,
  );
  const recommendationIds = selection?.recommendationIds ?? [];
  const [view, setView] = useState<BenchmarkView>("current");
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: benchmarkKeys.detail(source, currency, recommendationIds),
    queryFn: () =>
      getBenchmark<BenchmarkResponse>(source, currency, recommendationIds),
    placeholderData: keepPreviousData,
  });

  if (isPending) return <BenchmarkLoading />;
  if (isError)
    return (
      <Banner
        title="팀 벤치마킹을 불러오지 못했어요"
        description={error.message}
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );

  return (
    <>
      <div className="flex flex-wrap items-center gap-gap-medium">
        {!demo && (
          <BenchmarkToolbar
            view={view}
            onViewChange={setView}
            appliedCount={data.appliedRecommendationIds.length}
            selectedMonthlySavings={data.selectedMonthlySavings}
            currency={data.currency}
          />
        )}
        <BenchmarkNotes notes={data.notes} />
      </div>
      <BenchmarkBody data={data} view={view} />
    </>
  );
}

function BenchmarkLoading() {
  return (
    <div className="flex flex-col gap-gap-medium">
      <Skeleton shape="block" className="h-35 w-full" />
      <Skeleton shape="block" className="h-35 w-full" />
    </div>
  );
}

export function BenchmarkScreen() {
  return (
    <div className="flex flex-col gap-spacing-medium">
      <PageHeader
        title="팀 벤치마킹"
        description="비슷한 규모 팀과 비교해 우리 팀의 비용 효율을 봐요."
      />
      <DataSourceGate loading={<BenchmarkLoading />}>
        {(source) => <BenchmarkContent source={source} />}
      </DataSourceGate>
    </div>
  );
}
