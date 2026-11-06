"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Currency } from "@/api/costs";
import type { DailyCostWithInstances } from "@/api/dashboard";
import { formatMoney } from "@/lib/formatMoney";
import { ChartTooltip } from "./ChartTooltip";
import { formatShortDate } from "./dashboardFormat";

type DailyCostChartProps = {
  days: DailyCostWithInstances[];
  currency: Currency;
  onSelectDay: (day: DailyCostWithInstances) => void;
};

export function DailyCostChart({
  days,
  currency,
  onSelectDay,
}: DailyCostChartProps) {
  const spikeDates = days
    .filter((day) => day.spike)
    .map((day) => formatShortDate(day.date));
  const first = days[0];
  const last = days.at(-1);
  const summary = [
    first && last
      ? `${formatShortDate(first.date)}~${formatShortDate(last.date)} 일별 추정 비용 막대 차트`
      : "일별 추정 비용 막대 차트",
    spikeDates.length > 0 ? `급증일 ${spikeDates.join(", ")}` : "급증일 없음",
  ].join(", ");
  return (
    <div role="img" aria-label={summary} className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={days}
          accessibilityLayer={false}
          margin={{ top: 16, right: 0, bottom: 0, left: 0 }}
        >
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tickFormatter={formatShortDate}
            minTickGap={80}
            tick={{ fill: "var(--color-text-quaternary)", fontSize: 12 }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "var(--color-fill-neutral-weak)" }}
            content={({ active, payload }) => {
              const day = payload?.[0]?.payload as
                DailyCostWithInstances | undefined;
              return active && day ? (
                <ChartTooltip
                  title={formatShortDate(day.date)}
                  value={
                    day.estimatedCost === null
                      ? "—"
                      : formatMoney(day.estimatedCost, currency)
                  }
                  hint={day.spike ? `평소의 ${day.spike.ratio}배` : undefined}
                />
              ) : null;
            }}
          />
          <Bar
            dataKey="estimatedCost"
            radius={[4, 4, 0, 0]}
            onClick={(day) =>
              onSelectDay(day as unknown as DailyCostWithInstances)
            }
          >
            {days.map((day) => (
              <Cell
                key={day.date}
                fill={
                  day.spike
                    ? "var(--color-fill-danger)"
                    : "var(--color-fill-brand)"
                }
              />
            ))}
            <LabelList
              position="top"
              fill="var(--color-text-danger)"
              fontSize={12}
              valueAccessor={(entry) =>
                (entry.payload as DailyCostWithInstances).spike ? "▲" : ""
              }
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
