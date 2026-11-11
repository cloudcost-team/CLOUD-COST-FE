import type { Budget, BudgetCurrency } from "@/api/budget";
import { Panel } from "@/components/ui/Panel";
import { ProgressBar, type ProgressBarTone } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/formatMoney";

function getTone(usageRate: number): ProgressBarTone {
  if (usageRate >= 100) return "danger";
  if (usageRate >= 80) return "warning";
  return "brand";
}

type BudgetUsageProps = {
  forecastMonthEndCost: number | null;
  currency: BudgetCurrency;
  usageRate?: Budget["usageRate"];
  className?: string;
};

export function BudgetUsage({
  forecastMonthEndCost,
  currency,
  usageRate,
  className,
}: BudgetUsageProps) {
  return (
    <Panel
      size="medium"
      className={cn("flex flex-col gap-gap-small", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-gap-small text-subtext-medium">
        {forecastMonthEndCost === null ? (
          <p className="text-text-tertiary">
            사용 기록이 없어 이번 달 월말 예상 비용을 아직 계산할 수 없어요
          </p>
        ) : (
          <p className="text-text-secondary">
            이번 달 월말 예상 비용 {formatMoney(forecastMonthEndCost, currency)}
          </p>
        )}
        {usageRate !== null && usageRate !== undefined && (
          <p className="text-label-xsmall text-text-strong">
            예산의 {usageRate}%
          </p>
        )}
      </div>
      {usageRate !== null && usageRate !== undefined && (
        <ProgressBar
          value={usageRate}
          tone={getTone(usageRate)}
          aria-label={`예산의 ${usageRate}%`}
        />
      )}
    </Panel>
  );
}
