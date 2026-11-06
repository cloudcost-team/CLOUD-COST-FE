import type { Budget, BudgetCurrency } from "@/api/budget";
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
    <div
      className={cn(
        "flex flex-col gap-gap-small rounded-large bg-background-lower p-padding-medium",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-gap-small text-subtext-medium">
        <p className="text-text-secondary">
          이번 달 예상{" "}
          {forecastMonthEndCost === null
            ? "—"
            : formatMoney(forecastMonthEndCost, currency)}{" "}
          <span className="text-text-tertiary">(추정)</span>
        </p>
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
    </div>
  );
}
