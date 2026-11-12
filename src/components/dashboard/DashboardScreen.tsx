"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AwsAccount } from "@/api/awsAccounts";
import {
  costKeys,
  getDailyCosts,
  getMonthlyCosts,
  type Currency,
  type DailyCost,
} from "@/api/costs";
import type { DataSource } from "@/api/dataSource";
import { dashboardKeys, getDashboard, getInstances } from "@/api/dashboard";
import type { ExchangeRate } from "@/api/reports";
import { DataSourceGate } from "@/components/layout/DataSourceGate";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { NotificationBellIcon } from "@/components/ui/NotificationBellIcon";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { Card } from "@/components/ui/Card";
import { CostBasisPopover } from "@/components/ui/CostBasisPopover";
import { IconButton } from "@/components/ui/IconButton";
import { NoticeList } from "@/components/ui/NoticeList";
import { Popover } from "@/components/ui/Popover";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useAppMode } from "@/hooks/useAppMode";
import { formatKstDate, shiftYearMonth } from "@/lib/kstDate";
import { useCurrencyStore } from "@/stores/currencyStore";
import { DailyCostChart } from "./DailyCostChart";
import { DashboardStateContent } from "./DashboardStates";
import { DashboardStats } from "./DashboardStats";
import { DayDetailPanel } from "./DayDetailPanel";
import { FreshnessLine } from "./FreshnessLine";
import { MonthlyCostChart } from "./MonthlyCostChart";
import { SavingsOpportunityCard } from "./SavingsOpportunityCard";
import { ServerCostTable } from "./ServerCostTable";
import { formatDateRange } from "./dashboardFormat";

export type CostFreshness = {
  instancesRefreshedAt: string | null;
  instancesFromCache: boolean;
  usageRefreshedAt: string | null;
  usageFromCache: boolean;
  nextUsageRefreshAt: string | null;
  warnings: string[];
  warningDetails?: { code: string; message: string }[];
};

type CostEnvelope = {
  dataSource: "aws" | "demo";
  costBasis: "estimated_on_demand";
  currency: Currency;
  exchangeRate: ExchangeRate | null;
  freshness: CostFreshness;
  notes: string[];
};

export type InstanceCost = {
  instanceId: string;
  name: string | null;
  instanceType: string;
  state: string;
  usageHours: number;
  estimatedHourlyCost: number | null;
  estimatedCost: number | null;
  note: string | null;
};

export type DailyCostWithInstances = DailyCost & {
  instances: InstanceCost[];
};

export type DailyCostsWithInstancesResponse = CostEnvelope & {
  from: string;
  to: string;
  availableFrom: string | null;
  days: DailyCostWithInstances[];
};

export type MonthlyCost = {
  month: string;
  usageHours: number;
  estimatedCost: number | null;
  estimatedCostChange: number | null;
  instances: InstanceCost[];
};

export type MonthlyCostsResponse = CostEnvelope & {
  availableFrom: string | null;
  months: MonthlyCost[];
};

export type Ec2Instance = {
  instanceId: string;
  name: string | null;
  instanceType: string;
  region: string;
  availabilityZone: string;
  state: string;
  launchTime: string;
  platformDetails: string;
  tenancy: string;
  spot: boolean;
  present: boolean;
  currentRun: { since: string; hours: number; note: string } | null;
  estimatedHourlyCost: number | null;
  note: string | null;
};

export type InstancesResponse = CostEnvelope & {
  instances: Ec2Instance[];
};

export type DashboardBudget = {
  amount: number | null;
  enteredAmount: number;
  enteredCurrency: Currency;
  usageRate: number | null;
  thresholdReached: number | null;
};

export type DashboardLatestSpike = {
  date: string;
  cost: number;
  ratio: number;
  baseline: number;
  baselineDays: number;
  causeInstanceId: string | null;
  causeName: string | null;
  message: string;
};

export type DashboardResponse = CostEnvelope & {
  accountId: string | null;
  timezone: string;
  today: string;
  month: string;
  availableFrom: string | null;
  monthToDate: {
    from: string;
    to: string;
    usageHours: number;
    estimatedCost: number | null;
  };
  instanceCounts: { running: number; stopped: number };
  forecast: {
    monthEndCost: number;
    costThroughYesterday: number;
    dailyAverage: number;
    basisFrom: string;
    basisTo: string;
    basisDays: number;
    remainingDays: number;
  } | null;
  budget: DashboardBudget | null;
  previousMonthSamePeriod: {
    currentFrom: string;
    currentTo: string;
    currentCost: number;
    previousFrom: string;
    previousTo: string;
    previousCost: number;
    change: number;
    changeRate: number | null;
  } | null;
  latestSpike: DashboardLatestSpike | null;
  asOf: string;
};

type DateRange = { from: string; to: string };
type ServerTab = "cost" | "instances";

const serverTabOptions: { value: ServerTab; label: string }[] = [
  { value: "cost", label: "서버별 비용" },
  { value: "instances", label: "서버 목록" },
];

function getRecentMonthsRange(): DateRange {
  const month = formatKstDate(new Date()).slice(0, 7);
  return { from: shiftYearMonth(month, -11), to: month };
}

function useDashboardQueries(source: DataSource, range: DateRange | null) {
  const currency = useCurrencyStore((state) => state.currency);
  const monthlyRange = getRecentMonthsRange();
  return [
    useQuery({
      queryKey: dashboardKeys.summary(source, currency),
      queryFn: () => getDashboard<DashboardResponse>(source, currency),
    }),
    useQuery({
      queryKey: costKeys.daily(source, currency, range),
      queryFn: () =>
        getDailyCosts<DailyCostsWithInstancesResponse>(source, currency, range),
      placeholderData: keepPreviousData,
    }),
    useQuery({
      queryKey: costKeys.monthly(source, currency, monthlyRange),
      queryFn: () =>
        getMonthlyCosts<MonthlyCostsResponse>(source, currency, monthlyRange),
    }),
    useQuery({
      queryKey: dashboardKeys.instances(source, currency),
      queryFn: () => getInstances<InstancesResponse>(source, currency),
    }),
  ] as const;
}

function DateRangePicker({
  from,
  to,
  availableFrom,
  onApply,
}: {
  from: string;
  to: string;
  availableFrom: string | null;
  onApply: (range: DateRange) => void;
}) {
  const today = new Date();
  const firstDay = availableFrom ? parseISO(availableFrom) : undefined;
  const calendarProps = {
    mode: "single",
    captionLayout: "dropdown",
    showOutsideDays: false,
    startMonth: firstDay,
    endMonth: today,
    disabled: firstDay
      ? [{ before: firstDay }, { after: today }]
      : { after: today },
  } as const;
  const [open, setOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState<Date | undefined>();
  const [draftTo, setDraftTo] = useState<Date | undefined>();
  const valid = draftFrom && draftTo && draftFrom <= draftTo;
  const fields = [
    { label: "시작일", value: draftFrom, onSelect: setDraftFrom },
    { label: "종료일", value: draftTo, onSelect: setDraftTo },
  ];

  function changeOpen(next: boolean) {
    if (next) {
      setDraftFrom(parseISO(from));
      setDraftTo(parseISO(to));
    }
    setOpen(next);
  }

  function apply() {
    if (!draftFrom || !draftTo) return;
    onApply({
      from: format(draftFrom, "yyyy-MM-dd"),
      to: format(draftTo, "yyyy-MM-dd"),
    });
    setOpen(false);
  }

  return (
    <Popover
      open={open}
      onOpenChange={changeOpen}
      title="기간 선택"
      align="end"
      className="w-200"
      trigger={(props) => (
        <Button {...props} variant="assistive" size="medium" icon="calendar">
          {formatDateRange(from, to)}
        </Button>
      )}
      actions={
        <>
          <Button
            variant="assistive"
            size="small"
            onClick={() => setOpen(false)}
          >
            취소
          </Button>
          <Button size="small" disabled={!valid} onClick={apply}>
            적용
          </Button>
        </>
      }
      helper="기록 시작일 이후, 최대 455일까지 볼 수 있어요."
    >
      <div className="grid gap-gap-medium sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.label}
            className="flex flex-col gap-gap-large rounded-large border border-border-default p-padding-medium"
          >
            <div className="flex items-baseline justify-between gap-gap-small border-b border-border-weak pb-padding-small">
              <p className="text-subtext-medium text-text-tertiary">
                {field.label}
              </p>
              <p className="text-title-xsmall text-text-strong tabular-nums">
                {field.value ? format(field.value, "yyyy.MM.dd") : "—"}
              </p>
            </div>
            <Calendar
              {...calendarProps}
              selected={field.value}
              onSelect={field.onSelect}
              defaultMonth={field.value}
              aria-label={field.label}
              classNames={{
                weekday:
                  "flex h-10 flex-1 items-center justify-center text-subtext-medium text-text-tertiary",
                day_button:
                  "size-10 cursor-pointer rounded-medium text-subtext-medium text-text-primary outline-none hover:bg-fill-brand-weak hover:text-text-brand focus-visible:ring-2 focus-visible:ring-border-brand",
              }}
            />
          </div>
        ))}
      </div>
    </Popover>
  );
}

function MonthlyCostCard({
  months,
  selectedMonth,
  onSelectMonth,
}: {
  months: MonthlyCost[];
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
}) {
  const index = months.findIndex((item) => item.month === selectedMonth);
  return (
    <Card
      title="월별 비용 · 최근 12개월"
      action={
        <div className="flex items-center gap-gap-small">
          <IconButton
            icon="chevron-left"
            variant="weak"
            aria-label="이전 달"
            disabled={index <= 0}
            onClick={() => onSelectMonth(months[index - 1].month)}
          />
          <span className="text-label-xsmall text-text-strong">
            {selectedMonth.replace("-", "년 ")}월
          </span>
          <IconButton
            icon="chevron-right"
            variant="weak"
            aria-label="다음 달"
            disabled={index >= months.length - 1}
            onClick={() => onSelectMonth(months[index + 1].month)}
          />
        </div>
      }
    >
      <MonthlyCostChart
        months={months}
        selectedMonth={selectedMonth}
        onSelectMonth={onSelectMonth}
      />
      <p className="text-subtext-medium text-text-tertiary">
        {Number(selectedMonth.slice(5))}월 비용을 선택하면 아래 서버별 비용도
        같은 달 기준으로 바뀌어요.
      </p>
    </Card>
  );
}

function ServerSection({
  month,
  monthRows,
  instances,
  currency,
}: {
  month: string;
  monthRows: InstanceCost[];
  instances: Ec2Instance[];
  currency: Currency;
}) {
  const [serverTab, setServerTab] = useState<ServerTab>("cost");
  const rows =
    serverTab === "cost"
      ? monthRows
      : instances.map((item) => ({
          instanceId: item.instanceId,
          name: item.name,
          instanceType: item.instanceType,
          state: item.state,
          usageHours: item.currentRun?.hours ?? 0,
          estimatedHourlyCost: item.estimatedHourlyCost,
          estimatedCost: null,
          note: item.note,
        }));
  return (
    <section className="flex flex-col gap-gap-medium">
      <div className="flex flex-wrap items-center justify-between gap-gap-medium">
        <h2 className="text-title-small text-text-strong">
          서버별 비용 · {month.replaceAll("-", ".")}
        </h2>
        <SegmentedControl
          options={serverTabOptions}
          value={serverTab}
          onChange={setServerTab}
          aria-label="서버 정보"
        />
      </div>
      <ServerCostTable rows={rows} currency={currency} />
    </section>
  );
}

function ConnectionErrorBanner({ connection }: { connection: AwsAccount }) {
  const router = useRouter();
  return (
    <Banner
      title="AWS 연결을 확인해 주세요"
      description={
        connection.lastError?.message ??
        "저장된 기록은 볼 수 있지만 새 데이터는 가져오지 못하고 있어요."
      }
      action={{
        label: "연결 상세 보기",
        onClick: () =>
          router.push(`/settings/connections/${connection.accountId}`),
      }}
    />
  );
}

function DashboardView({
  source,
  dashboard,
  daily,
  monthly,
  instances,
  range,
  onRangeChange,
}: {
  source: DataSource;
  dashboard: DashboardResponse;
  daily: DailyCostsWithInstancesResponse;
  monthly: MonthlyCostsResponse;
  instances: InstancesResponse;
  range: DateRange | null;
  onRangeChange: (range: DateRange) => void;
}) {
  const [selectedDay, setSelectedDay] = useState<DailyCostWithInstances | null>(
    null,
  );
  const [pickedMonth, setPickedMonth] = useState<string | null>(null);
  const days = daily.days;
  const selectedIndex = selectedDay
    ? days.findIndex((day) => day.date === selectedDay.date)
    : -1;
  const selectedMonthData =
    monthly.months.find((month) => month.month === pickedMonth) ??
    monthly.months.at(-1);
  const latestSpike = dashboard.latestSpike;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-gap-medium">
        <div className="flex flex-wrap items-center gap-gap-medium">
          <FreshnessLine freshness={dashboard.freshness} />
          <CostBasisPopover
            align="start"
            exchangeRateDate={dashboard.exchangeRate?.date}
          />
        </div>
        {source.kind === "aws" && (
          <DateRangePicker
            from={daily.from}
            to={daily.to}
            availableFrom={dashboard.availableFrom}
            onApply={onRangeChange}
          />
        )}
      </div>
      {source.kind === "aws" && source.account.status === "ERROR" && (
        <ConnectionErrorBanner connection={source.account} />
      )}
      {dashboard.freshness.warnings.length > 0 && (
        <Banner
          tone="warning"
          title="일부 데이터를 새로 가져오지 못했어요"
          description={dashboard.freshness.warnings.join(" ")}
        />
      )}
      {latestSpike && (
        <Banner
          icon={<NotificationBellIcon />}
          title={latestSpike.message}
          description={
            latestSpike.causeName
              ? `${latestSpike.causeName} 사용 시간이 늘었어요. 일별 그래프의 빨간 막대를 확인해 주세요.`
              : undefined
          }
          action={{
            label: "그날 보기",
            onClick: () =>
              setSelectedDay(
                days.find((day) => day.date === latestSpike.date) ?? null,
              ),
          }}
        />
      )}
      <SavingsOpportunityCard source={source} />
      <DashboardStats dashboard={dashboard} />
      <Card
        title={`일별 비용 · ${range || source.kind === "demo" ? formatDateRange(daily.from, daily.to) : "최근 30일"}`}
        action={
          <>
            <div className="flex gap-gap-medium text-subtext-small text-text-tertiary">
              <span>● 비용</span>
              <span className="text-text-danger">▲ 급증일</span>
            </div>
            <Button
              variant="assistive"
              size="small"
              disabled={days.length === 0}
              onClick={() => setSelectedDay(days.at(-1) ?? null)}
            >
              날짜별 상세 보기
            </Button>
          </>
        }
      >
        <DailyCostChart
          days={days}
          currency={daily.currency}
          onSelectDay={setSelectedDay}
        />
      </Card>
      {selectedMonthData && (
        <>
          <MonthlyCostCard
            months={monthly.months}
            selectedMonth={selectedMonthData.month}
            onSelectMonth={setPickedMonth}
          />
          <ServerSection
            month={selectedMonthData.month}
            monthRows={selectedMonthData.instances}
            instances={instances.instances}
            currency={monthly.currency}
          />
        </>
      )}
      <NoticeList lines={dashboard.notes} />
      <DayDetailPanel
        day={selectedDay}
        currency={daily.currency}
        onClose={() => setSelectedDay(null)}
        onMove={(offset) => {
          const next = days[selectedIndex + offset];
          if (next) setSelectedDay(next);
        }}
      />
    </>
  );
}

const COLLECTION_ERROR_CODES = ["COLLECTION_FAILED", "CONNECTION_ERROR"];

function isCollectionFailed(freshness: CostFreshness) {
  return (freshness.warningDetails ?? []).some((detail) =>
    COLLECTION_ERROR_CODES.includes(detail.code),
  );
}

function DashboardContent({ source }: { source: DataSource }) {
  const [range, setRange] = useState<DateRange | null>(null);
  const queries = useDashboardQueries(source, range);
  const [summary, daily, monthly, instances] = queries;
  const failed = queries.find((query) => query.isError && !query.data);
  const staleFailed = queries.find((query) => query.isError && query.data);
  const retryFailed = () =>
    queries
      .filter((query) => query.isError)
      .forEach((query) => query.refetch());

  if (failed)
    return (
      <Banner
        title="대시보드를 불러오지 못했어요"
        description={failed.error?.message}
        action={{ label: "다시 시도", onClick: retryFailed }}
      />
    );
  if (!summary.data || !daily.data || !monthly.data || !instances.data)
    return <DashboardStateContent state="loading" />;
  if (summary.data.availableFrom === null)
    return isCollectionFailed(summary.data.freshness) ? (
      <DashboardStateContent
        state="connection-error"
        onRetry={() => summary.refetch()}
      />
    ) : (
      <DashboardStateContent
        state="no-instances"
        region={source.kind === "aws" ? source.account.region : undefined}
        regionLabel={
          source.kind === "aws" ? source.account.regionLabel : undefined
        }
      />
    );

  return (
    <>
      {staleFailed && (
        <Banner
          tone="warning"
          title="최신 데이터를 불러오지 못해 이전 데이터를 보여 주고 있어요"
          description={staleFailed.error?.message}
          action={{ label: "다시 시도", onClick: retryFailed }}
        />
      )}
      <DashboardView
        source={source}
        dashboard={summary.data}
        daily={daily.data}
        monthly={monthly.data}
        instances={instances.data}
        range={range}
        onRangeChange={setRange}
      />
    </>
  );
}

export function DashboardScreen() {
  const { demo } = useAppMode();
  return (
    <div className="flex flex-col gap-spacing-medium">
      <PageHeader
        title="대시보드"
        description="EC2 사용 시간과 비용을 한눈에 봐요."
        actions={
          demo ? (
            <Badge>체험 데이터</Badge>
          ) : (
            <Badge tone="info">실제 AWS</Badge>
          )
        }
      />
      <DataSourceGate loading={<DashboardStateContent state="loading" />}>
        {(source) => <DashboardContent source={source} />}
      </DataSourceGate>
    </div>
  );
}
