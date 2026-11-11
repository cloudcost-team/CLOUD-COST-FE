"use client";

import { useState } from "react";
import type { DataSource } from "@/api/dataSource";
import type { WasteKind, WasteResponse, WasteSort } from "@/api/waste";
import { DataSourceGate } from "@/components/layout/DataSourceGate";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { CostBasisPopover } from "@/components/ui/CostBasisPopover";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { Icon } from "@/components/ui/Icon";
import { NoticeList } from "@/components/ui/NoticeList";
import { Panel } from "@/components/ui/Panel";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { formatMoney } from "@/lib/formatMoney";
import {
  formatKoreanMonthDay,
  formatKstDate,
  formatMonthDay,
} from "@/lib/kstDate";
import { useWaste } from "@/hooks/useWaste";
import { RecommendationCard } from "./RecommendationCard";
import { RecommendationDetailPanel } from "./RecommendationDetailPanel";
import { SkippedServersPopover } from "./SkippedServersPopover";

type WasteFilter = "ALL" | WasteKind;

const sortOptions = [
  { value: "SAVINGS", label: "절감액 큰 순" },
  { value: "COST", label: "현재 비용 큰 순" },
  { value: "UTILIZATION", label: "사용률 낮은 순" },
  { value: "NAME", label: "이름순" },
] satisfies { value: WasteSort; label: string }[];

function WasteSummary({ data }: { data: WasteResponse }) {
  return (
    <div className="grid gap-gap-large md:grid-cols-3">
      <StatCard
        label="예상 절감액"
        value={`월 ${formatMoney(data.totalMonthlySavings, data.currency)}`}
        caption="모든 추천을 적용했을 때"
      />
      <StatCard
        label="발견한 항목"
        value={`${data.findingCount}건`}
        caption={`과다 사양 ${data.counts.oversized} · 유휴 ${data.counts.idle}`}
      />
      <StatCard
        label="이번 달 예상 비용 대비"
        value={
          data.savingsRateOfForecast === null
            ? "—"
            : `${data.savingsRateOfForecast}%`
        }
        caption={
          data.forecastMonthEndCost === null
            ? "월말 예상 비용이 없어요"
            : `월말 예상 ${formatMoney(data.forecastMonthEndCost, data.currency)} 기준`
        }
      />
    </div>
  );
}

function WasteBasisLine({ data }: { data: WasteResponse }) {
  const from = formatMonthDay(formatKstDate(new Date(data.window.from)));
  const to = formatMonthDay(formatKstDate(new Date(data.window.to)));
  return (
    <div className="flex flex-wrap items-center justify-between gap-gap-medium">
      <div className="flex flex-wrap items-center gap-gap-medium text-subtext-medium text-text-tertiary">
        <p className="flex items-center gap-gap-xsmall">
          <Icon name="bar-chart" size={16} className="text-icon-tertiary" />
          {`${from}~${to} (KST) CloudWatch CPU·네트워크 기록으로 판단 · 24시간 이상 켜진 서버 ${data.judgedCount}대`}
        </p>
        {data.skipped.length > 0 && (
          <SkippedServersPopover skipped={data.skipped} />
        )}
      </div>
      <CostBasisPopover exchangeRateDate={data.exchangeRate?.date} />
    </div>
  );
}

function WasteStatusState({ data }: { data: WasteResponse }) {
  if (data.status === "NONE_FOUND")
    return (
      <EmptyState
        variant="card"
        icon="check-circle"
        title="지금은 줄일 항목을 찾지 못했어요"
        description="최근 14일 사용량을 계속 살펴보고 새 추천이 생기면 알려 드릴게요."
      />
    );
  return (
    <EmptyState
      variant="card"
      icon="clock"
      title="판단할 기록을 모으고 있어요"
      description={
        data.availableAt
          ? `정확한 추천에는 최근 14일 사용 기록이 필요해요. ${formatKoreanMonthDay(data.availableAt)}부터 추천을 보여 드려요.`
          : "정확한 추천에는 최근 14일 사용 기록이 필요해요."
      }
    />
  );
}

function WasteBody({ source }: { source: DataSource }) {
  const [filter, setFilter] = useState<WasteFilter>("ALL");
  const [sort, setSort] = useState<WasteSort>("SAVINGS");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isPending, isError, error, refetch } = useWaste(
    source,
    sort,
    filter === "ALL" ? null : filter,
  );

  if (isPending) return <WasteLoading />;
  if (isError)
    return (
      <Banner
        title="낭비 리소스를 불러오지 못했어요"
        description={error.message}
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );

  const selected =
    data.items.find((item) => item.recommendationId === selectedId) ?? null;
  const filters = [
    { value: "ALL", label: `전체 ${data.findingCount}` },
    { value: "OVERSIZED", label: `과다 사양 ${data.counts.oversized}` },
    { value: "IDLE", label: `유휴 ${data.counts.idle}` },
  ] satisfies { value: WasteFilter; label: string }[];

  return (
    <>
      {data.freshness.warnings.length > 0 && (
        <Banner
          tone="warning"
          title="최신 데이터를 가져오지 못했어요"
          description={`저장된 기록을 기준으로 추천을 보여 드려요. ${data.freshness.warnings.join(" ")}`}
        />
      )}
      {data.status !== "OK" ? (
        <WasteStatusState data={data} />
      ) : (
        <>
          <WasteSummary data={data} />
          <WasteBasisLine data={data} />
          <div className="flex flex-wrap items-center justify-between gap-gap-medium">
            <FilterChips
              options={filters}
              value={filter}
              onChange={setFilter}
              aria-label="추천 종류"
            />
            <SegmentedControl
              options={sortOptions}
              value={sort}
              onChange={setSort}
              aria-label="추천 정렬"
            />
          </div>
          <div className="flex flex-col gap-gap-large">
            {data.items.map((item) => (
              <RecommendationCard
                key={item.recommendationId}
                item={item}
                currency={data.currency}
                onOpenDetail={() => setSelectedId(item.recommendationId)}
              />
            ))}
          </div>
          <Panel as="section">
            <div className="flex items-center gap-gap-small">
              <Badge>준비 중</Badge>
              <h2 className="text-label-small text-text-strong">
                미연결 볼륨 · 미사용 고정 IP · 스냅샷 · 로드밸런서
              </h2>
            </div>
            <p className="mt-gap-xsmall text-subtext-medium text-text-tertiary">
              지금 연결 권한(EC2·CloudWatch 읽기)으로는 찾을 수 없어요. 권한을
              추가하려면 ADR과 팀 승인이 먼저 필요해요.
            </p>
          </Panel>
        </>
      )}
      <NoticeList variant="plain" lines={data.notes} />
      <RecommendationDetailPanel
        item={selected}
        currency={data.currency}
        open={selected !== null}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}

export function WasteScreen() {
  return (
    <div className="flex flex-col gap-spacing-medium">
      <PageHeader
        title="낭비 리소스"
        description="EC2 사용률을 보고 줄일 수 있는 비용을 찾아요. 실제 변경은 AWS 콘솔에서 직접 해 주세요."
      />
      <DataSourceGate loading={<WasteLoading />}>
        {(source) => <WasteBody source={source} />}
      </DataSourceGate>
    </div>
  );
}

function WasteLoading() {
  return (
    <div className="flex flex-col gap-spacing-medium">
      <div className="grid gap-gap-large md:grid-cols-3">
        {[1, 2, 3].map((key) => (
          <Skeleton key={key} shape="block" className="h-28 w-full" />
        ))}
      </div>
      <Skeleton shape="block" className="h-36 w-full" />
      <Skeleton shape="block" className="h-36 w-full" />
    </div>
  );
}
