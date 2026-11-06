"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import type { Currency } from "@/api/costs";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDailyCosts } from "@/hooks/useReports";
import { formatMoney } from "@/lib/formatMoney";
import { formatMonthDay } from "@/lib/kstDate";

type ReportDailyChartProps = {
  accountId: string;
  from: string;
  to: string;
  monthLabel: string;
  currency: Currency;
};

export function ReportDailyChart({
  accountId,
  from,
  to,
  monthLabel,
  currency,
}: ReportDailyChartProps) {
  const { data, isPending, isError } = useDailyCosts(
    accountId,
    from,
    to,
    currency,
  );

  return (
    <div className="flex flex-col gap-gap-medium rounded-large border border-border-default p-padding-large">
      <div className="flex flex-wrap items-start justify-between gap-gap-small">
        <p className="text-label-xsmall text-text-strong">
          {monthLabel} 일별 추정 비용
        </p>
        <p className="text-subtext-small text-text-tertiary">
          빨간 막대 = 급증일
        </p>
      </div>
      {isPending && <Skeleton shape="block" className="h-30 w-full" />}
      {isError && (
        <p className="text-subtext-medium text-text-tertiary">
          일별 비용을 불러오지 못했어요
        </p>
      )}
      {data && (
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.days}
              margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis
                dataKey="date"
                tickFormatter={formatMonthDay}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={24}
                tick={{ fontSize: 12, fill: "var(--color-text-quaternary)" }}
              />
              <Tooltip
                cursor={{ fill: "var(--color-fill-neutral-weak)" }}
                formatter={(value) =>
                  typeof value === "number"
                    ? formatMoney(value, currency)
                    : "단가 없음"
                }
                labelFormatter={(label) => formatMonthDay(String(label))}
              />
              <Bar
                dataKey="estimatedCost"
                name="추정 비용"
                radius={[2, 2, 0, 0]}
                isAnimationActive={false}
              >
                {data.days.map((day) => (
                  <Cell
                    key={day.date}
                    fill={
                      day.spike
                        ? "var(--color-fill-danger)"
                        : "var(--color-fill-brand-weak)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
