"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Currency } from "@/api/costs";
import { getSourceId, type DataSource } from "@/api/dataSource";
import type { ExchangeRate } from "@/api/reports";
import { simulate, simulationKeys } from "@/api/simulations";
import type { Freshness, WasteItem, WasteKind } from "@/api/waste";
import { DataSourceGate } from "@/components/layout/DataSourceGate";
import { PageHeader } from "@/components/layout/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { NoticeList } from "@/components/ui/NoticeList";
import { Skeleton } from "@/components/ui/Skeleton";
import { Slider } from "@/components/ui/Slider";
import { useAppPath } from "@/hooks/useAppMode";
import { useWaste } from "@/hooks/useWaste";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useSimulationSelectionStore } from "@/stores/simulationSelectionStore";
import { ChangeSelectItem } from "./ChangeSelectItem";
import { SimulationResultCard } from "./SimulationResultCard";

export type SimulationSelectedItem = {
  recommendationId: string;
  instanceId: string;
  name: string | null;
  kind: WasteKind;
  kindLabel: string;
  action: string;
  monthlySavings: number;
};

export type SimulationCost = {
  monthlyCost: number | null;
  budgetRate: number | null;
};

export type SimulationBudget = {
  amount: number;
  enteredAmount: number;
  enteredCurrency: Currency;
};

export type SimulationResponse = {
  dataSource: "aws" | "demo";
  costBasis: "estimated_on_demand";
  currency: Currency;
  exchangeRate?: ExchangeRate | null;
  status: "OK" | "NO_FORECAST";
  trafficGrowthPercent: number;
  selectedCount: number;
  selected: SimulationSelectedItem[];
  selectedMonthlySavings: number | null;
  forecastMonthEndCost: number | null;
  before: SimulationCost | null;
  after: SimulationCost | null;
  monthlySavings: number | null;
  yearlySavings: number | null;
  budget: SimulationBudget | null;
  withinBudget: boolean | null;
  freshness: Freshness;
  notes: string[];
  asOf: string;
};

type SimulatorScreenProps = {
  initialRecommendationId?: string;
};

const GROWTH_DEBOUNCE_MS = 300;

export function useSimulation(
  source: DataSource,
  recommendationIds: string[],
  trafficGrowthPercent: number,
  enabled = true,
) {
  const currency = useCurrencyStore((state) => state.currency);
  const input = { recommendationIds, trafficGrowthPercent };
  return useQuery({
    queryKey: simulationKeys.result(source, currency, input),
    queryFn: () => simulate<SimulationResponse>(source, currency, input),
    placeholderData: keepPreviousData,
    enabled,
  });
}

function getInitialIds(
  items: WasteItem[],
  initialRecommendationId: string | undefined,
  savedIds: string[] | undefined,
) {
  const ids = items.map((item) => item.recommendationId);
  if (initialRecommendationId && ids.includes(initialRecommendationId))
    return [initialRecommendationId];
  if (savedIds) return savedIds.filter((id) => ids.includes(id));
  return ids;
}

function useDebouncedValue(value: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), GROWTH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value]);
  return debounced;
}

function SimulationResult({
  source,
  recommendationIds,
  trafficGrowthPercent,
}: {
  source: DataSource;
  recommendationIds: string[];
  trafficGrowthPercent: number;
}) {
  const { data, isPending, isError, error, refetch } = useSimulation(
    source,
    recommendationIds,
    trafficGrowthPercent,
  );
  if (isPending) return <Skeleton shape="block" className="h-96 w-full" />;
  if (isError)
    return (
      <Banner
        title="시뮬레이션 결과를 불러오지 못했어요"
        description={error.message}
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  return (
    <div className="flex flex-col gap-gap-medium">
      <SimulationResultCard data={data} />
      <NoticeList
        variant="plain"
        lines={[...data.freshness.warnings, ...data.notes]}
      />
    </div>
  );
}

function SimulatorBody({
  source,
  items,
  currency,
  initialRecommendationId,
}: {
  source: DataSource;
  items: WasteItem[];
  currency: Currency;
  initialRecommendationId?: string;
}) {
  const accountId = getSourceId(source);
  const saved = useSimulationSelectionStore((state) =>
    state.selection?.accountId === accountId ? state.selection : null,
  );
  const save = useSimulationSelectionStore((state) => state.save);
  const [selectedIds, setSelectedIds] = useState(() =>
    getInitialIds(items, initialRecommendationId, saved?.recommendationIds),
  );
  const [growth, setGrowth] = useState(saved?.trafficGrowthPercent ?? 0);
  const debouncedGrowth = useDebouncedValue(growth);

  useEffect(() => {
    save({
      accountId,
      recommendationIds: selectedIds,
      trafficGrowthPercent: debouncedGrowth,
    });
  }, [accountId, selectedIds, debouncedGrowth, save]);

  function changeItem(id: string, checked: boolean) {
    setSelectedIds((current) =>
      checked
        ? [...current, id]
        : current.filter((selected) => selected !== id),
    );
  }

  return (
    <div className="grid items-start gap-gap-xlarge xl:grid-cols-[minmax(0,1fr)_23.75rem]">
      <div className="flex flex-col gap-gap-xlarge">
        <Card
          title="적용할 변경"
          action={
            <span className="text-subtext-medium text-text-tertiary">
              {selectedIds.length} / {items.length}
            </span>
          }
        >
          <div>
            {items.map((item) => (
              <ChangeSelectItem
                key={item.recommendationId}
                item={item}
                currency={currency}
                checked={selectedIds.includes(item.recommendationId)}
                onCheckedChange={(checked) =>
                  changeItem(item.recommendationId, checked)
                }
              />
            ))}
          </div>
        </Card>
        <Card
          title="예상 사용량 증가"
          action={
            <span className="text-title-small text-text-brand">{growth}%</span>
          }
        >
          <Slider
            value={growth}
            min={0}
            max={100}
            step={1}
            onValueChange={setGrowth}
            minLabel="0%"
            markerLabel="+50%"
            maxLabel="+100%"
            aria-label="예상 사용량 증가"
          />
          <p className="text-subtext-medium text-text-tertiary">
            서버·DB·트래픽 사용량이 지금보다 이만큼 늘어난다고 보고, 늘어난 만큼
            비용을 다시 계산해요.
          </p>
        </Card>
      </div>
      <SimulationResult
        source={source}
        recommendationIds={selectedIds}
        trafficGrowthPercent={debouncedGrowth}
      />
    </div>
  );
}

function SimulatorContent({
  source,
  initialRecommendationId,
}: {
  source: DataSource;
  initialRecommendationId?: string;
}) {
  const appPath = useAppPath();
  const { data, isPending, isError, error, refetch } = useWaste(source);

  if (isPending) return <Skeleton shape="block" className="h-96 w-full" />;
  if (isError)
    return (
      <Banner
        title="적용할 변경 목록을 불러오지 못했어요"
        description={error.message}
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  if (data.items.length === 0)
    return (
      <EmptyState
        variant="card"
        icon="check-circle"
        title="적용할 변경이 없어요"
        description="낭비 리소스에서 추천이 생기면 여기서 효과를 미리 볼 수 있어요."
        action={{
          label: "낭비 리소스로 가기",
          href: appPath("/savings/waste"),
        }}
      />
    );
  return (
    <SimulatorBody
      source={source}
      items={data.items}
      currency={data.currency}
      initialRecommendationId={initialRecommendationId}
    />
  );
}

export function SimulatorScreen({
  initialRecommendationId,
}: SimulatorScreenProps) {
  return (
    <div className="flex flex-col gap-spacing-medium">
      <PageHeader
        title="비용 시뮬레이터"
        description="추천을 골라 적용하면 비용이 얼마나 바뀌는지 미리 봐요. 실제 변경은 AWS 콘솔에서 해 주세요."
      />
      <DataSourceGate
        loading={<Skeleton shape="block" className="h-96 w-full" />}
      >
        {(source) => (
          <SimulatorContent
            source={source}
            initialRecommendationId={initialRecommendationId}
          />
        )}
      </DataSourceGate>
    </div>
  );
}
