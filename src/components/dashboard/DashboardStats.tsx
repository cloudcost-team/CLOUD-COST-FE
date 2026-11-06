import type { DashboardResponse } from "@/api/dashboard";
import { StatCard } from "@/components/ui/StatCard";
import { formatMoney, formatSignedMoney } from "@/lib/formatMoney";
import { getMonthNumber } from "@/lib/kstDate";
import { formatHours, formatSignedRate } from "./dashboardFormat";

type DashboardStatsProps = {
  dashboard: DashboardResponse;
};

function getBudgetCaption(dashboard: DashboardResponse) {
  const { budget, currency } = dashboard;
  if (!budget) return "월 예산을 정하지 않았어요";
  if (budget.amount === null || budget.usageRate === null)
    return "환율 정보가 없어 예산 대비를 보여 줄 수 없어요";
  return `예산 ${formatMoney(budget.amount, currency)}의 ${budget.usageRate}%`;
}

function PreviousMonthCard({ dashboard }: DashboardStatsProps) {
  const comparison = dashboard.previousMonthSamePeriod;
  if (!comparison)
    return (
      <StatCard
        label="전월 대비"
        value="—"
        caption="비교할 전월 기록이 없어요"
      />
    );
  const previousMonth = getMonthNumber(comparison.previousFrom.slice(0, 7));
  return (
    <StatCard
      label="전월 대비"
      value={
        comparison.changeRate === null
          ? "—"
          : formatSignedRate(comparison.changeRate)
      }
      caption={`${previousMonth}월 같은 기간 대비 ${formatSignedMoney(comparison.change, dashboard.currency)}`}
    />
  );
}

export function DashboardStats({ dashboard }: DashboardStatsProps) {
  const { monthToDate, instanceCounts, forecast, currency, exchangeRate } =
    dashboard;
  return (
    <div className="grid gap-gap-large md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="이번 달 추정 비용"
        estimated
        value={
          monthToDate.estimatedCost === null
            ? "—"
            : formatMoney(monthToDate.estimatedCost, currency)
        }
        caption={
          exchangeRate
            ? `${exchangeRate.date} 환율로 환산한 추정치`
            : "온디맨드 단가 기준 추정치"
        }
      />
      <StatCard
        label="사용 시간"
        value={formatHours(monthToDate.usageHours)}
        caption={`실행 중 ${instanceCounts.running}대 · 중지 ${instanceCounts.stopped}대`}
      />
      <StatCard
        label="월말 예상 비용"
        estimated
        value={
          forecast === null ? "—" : formatMoney(forecast.monthEndCost, currency)
        }
        caption={getBudgetCaption(dashboard)}
      />
      <PreviousMonthCard dashboard={dashboard} />
    </div>
  );
}
