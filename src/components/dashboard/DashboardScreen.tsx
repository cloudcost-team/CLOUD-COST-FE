"use client";

import { useState } from "react";
import type {
  DailyCostWithInstances,
  DashboardResponse,
  InstancesResponse,
  MonthlyCostsResponse,
  CostsSummaryResponse,
} from "@/api/dashboard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { Card } from "@/components/ui/Card";
import { NoticeList } from "@/components/ui/NoticeList";
import { Popover } from "@/components/ui/Popover";
import { Tabs } from "@/components/ui/Tabs";
import { useCurrencyStore } from "@/stores/currencyStore";
import { DailyCostChart } from "./DailyCostChart";
import { DashboardStateContent, type DashboardState } from "./DashboardStates";
import { DashboardStats } from "./DashboardStats";
import { DayDetailPanel } from "./DayDetailPanel";
import { FreshnessLine } from "./FreshnessLine";
import { MonthlyCostChart } from "./MonthlyCostChart";
import { ServerCostTable } from "./ServerCostTable";
import { formatDateRange } from "./dashboardFormat";

type DashboardScreenProps = {
  krw: DashboardResponse;
  usd: DashboardResponse;
  daily: DailyCostWithInstances[];
  monthly: MonthlyCostsResponse;
  costs: CostsSummaryResponse;
  instances: InstancesResponse;
  state?: DashboardState;
};
type ServerTab = "cost" | "instances";

export function DashboardScreen({
  krw,
  usd,
  daily,
  monthly,
  costs,
  instances,
  state = "ready",
}: DashboardScreenProps) {
  const currency = useCurrencyStore((store) => store.currency);
  const dashboard = currency === "USD" ? usd : krw;
  const [rangeOpen, setRangeOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DailyCostWithInstances | null>(
    null,
  );
  const [selectedMonth, setSelectedMonth] = useState("2026-10");
  const [serverTab, setServerTab] = useState<ServerTab>("cost");
  if (state !== "ready") return <DashboardStateContent state={state} />;
  const selectedIndex = selectedDay
    ? daily.findIndex((day) => day.date === selectedDay.date)
    : -1;
  const selectedMonthData =
    monthly.months.find((month) => month.month === selectedMonth) ??
    monthly.months.at(-1);
  const serverRows = selectedMonthData?.instances.length
    ? selectedMonthData.instances
    : costs.instances;
  const tabs = [
    {
      value: "cost",
      label: "서버별 비용",
      content: (
        <ServerCostTable rows={serverRows} currency={dashboard.currency} />
      ),
    },
    {
      value: "instances",
      label: "서버 목록",
      content: (
        <ServerCostTable
          rows={instances.instances.map((item) => ({
            instanceId: item.instanceId,
            name: item.name,
            instanceType: item.instanceType,
            state: item.state,
            usageHours: item.currentRun?.hours ?? 0,
            estimatedHourlyCost: item.estimatedHourlyCost,
            estimatedCost: null,
            note: item.note,
          }))}
          currency={dashboard.currency}
        />
      ),
    },
  ] satisfies { value: ServerTab; label: string; content: React.ReactNode }[];
  return (
    <div className="flex flex-col gap-spacing-medium">
      <PageHeader
        title="대시보드"
        description="EC2 사용 시간과 추정 비용을 한눈에 봐요."
        actions={
          <>
            <Badge tone="info">실제 AWS</Badge>
            <Popover
              open={rangeOpen}
              onOpenChange={setRangeOpen}
              title="기간 선택"
              align="end"
              className="w-180"
              trigger={(props) => (
                <Button
                  {...props}
                  variant="assistive"
                  size="medium"
                  icon="calendar"
                >
                  {formatDateRange(
                    daily[0].date,
                    daily.at(-1)?.date ?? daily[0].date,
                  )}
                </Button>
              )}
              actions={
                <>
                  <Button
                    variant="assistive"
                    size="small"
                    onClick={() => setRangeOpen(false)}
                  >
                    취소
                  </Button>
                  <Button size="small" onClick={() => setRangeOpen(false)}>
                    적용
                  </Button>
                </>
              }
              helper="기록 시작일 이후, 최대 455일까지 볼 수 있어요."
            >
              <div className="grid gap-gap-medium sm:grid-cols-2">
                <Calendar mode="single" selected={new Date("2026-10-06")} />
                <Calendar mode="single" selected={new Date("2026-11-04")} />
              </div>
            </Popover>
          </>
        }
      />
      <FreshnessLine freshness={dashboard.freshness} />
      {dashboard.latestSpike && (
        <Banner
          title={dashboard.latestSpike.message}
          description={
            dashboard.latestSpike.causeName
              ? `${dashboard.latestSpike.causeName} 사용 시간이 늘었어요. 일별 그래프의 빨간 막대를 확인해 주세요.`
              : undefined
          }
          action={{
            label: "그날 보기",
            onClick: () =>
              setSelectedDay(
                daily.find((day) => day.date === dashboard.latestSpike?.date) ??
                  null,
              ),
          }}
        />
      )}
      <DashboardStats dashboard={dashboard} />
      <Card
        title="일별 추정 비용 · 최근 30일"
        action={
          <>
            <div className="flex gap-gap-medium text-subtext-small text-text-tertiary">
              <span>● 추정 비용</span>
              <span className="text-text-danger">▲ 급증일</span>
            </div>
            <Button
              variant="assistive"
              size="small"
              disabled={daily.length === 0}
              onClick={() => setSelectedDay(daily.at(-1) ?? null)}
            >
              날짜별 상세 보기
            </Button>
          </>
        }
      >
        <DailyCostChart
          days={daily}
          currency={dashboard.currency}
          onSelectDay={setSelectedDay}
        />
      </Card>
      <Card
        title="월별 추정 비용 · 최근 12개월"
        action={
          <div className="flex items-center gap-gap-small">
            <Button
              variant="assistive"
              size="small"
              icon="chevron-left"
              onClick={() => {
                const index = monthly.months.findIndex(
                  (item) => item.month === selectedMonth,
                );
                if (index > 0)
                  setSelectedMonth(monthly.months[index - 1].month);
              }}
            >
              이전
            </Button>
            <span className="text-label-xsmall text-text-strong">
              {selectedMonth.replace("-", "년 ")}월
            </span>
            <Button
              variant="assistive"
              size="small"
              onClick={() => {
                const index = monthly.months.findIndex(
                  (item) => item.month === selectedMonth,
                );
                if (index < monthly.months.length - 1)
                  setSelectedMonth(monthly.months[index + 1].month);
              }}
            >
              다음
            </Button>
          </div>
        }
      >
        <MonthlyCostChart
          months={monthly.months}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
        />
        <p className="text-subtext-medium text-text-tertiary">
          {selectedMonthData?.month.slice(5)}월 추정 비용을 선택하면 아래 서버별
          비용도 같은 달 기준으로 바뀌어요.
        </p>
      </Card>
      <section className="flex flex-col gap-gap-medium">
        <h2 className="text-title-small text-text-strong">
          서버별 비용 · {selectedMonth.replaceAll("-", ".")}
        </h2>
        <Tabs
          items={tabs}
          value={serverTab}
          onChange={setServerTab}
          aria-label="서버 정보"
        />
      </section>
      <NoticeList lines={dashboard.notes} />
      <DayDetailPanel
        day={selectedDay}
        currency={dashboard.currency}
        onClose={() => setSelectedDay(null)}
        onMove={(offset) => {
          const next = daily[selectedIndex + offset];
          if (next) setSelectedDay(next);
        }}
      />
    </div>
  );
}
