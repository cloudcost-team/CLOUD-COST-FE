"use client";

import { useEffect, useRef } from "react";
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
import type { DailyCostWithInstances } from "./DashboardScreen";
import { formatMoney } from "@/lib/formatMoney";
import { formatYearMonth } from "@/lib/kstDate";
import { ChartTooltip } from "./ChartTooltip";
import { formatShortDate } from "./dashboardFormat";

type DailyCostChartProps = {
  days: DailyCostWithInstances[];
  currency: Currency;
  onSelectDay: (day: DailyCostWithInstances) => void;
};

type MonthDays = { month: string; days: DailyCostWithInstances[] };

function groupByMonth(days: DailyCostWithInstances[]) {
  const months: MonthDays[] = [];
  for (const day of days) {
    const month = day.date.slice(0, 7);
    const current = months.at(-1);
    if (current?.month === month) current.days.push(day);
    else months.push({ month, days: [day] });
  }
  return months;
}

function getSummary(days: DailyCostWithInstances[]) {
  const spikeDates = days
    .filter((day) => day.spike)
    .map((day) => formatShortDate(day.date));
  const first = days[0];
  const last = days.at(-1);
  return [
    first && last
      ? `${formatShortDate(first.date)}~${formatShortDate(last.date)} 일별 추정 비용 막대 차트`
      : "일별 추정 비용 막대 차트",
    spikeDates.length > 0 ? `급증일 ${spikeDates.join(", ")}` : "급증일 없음",
  ].join(", ");
}

function MonthChart({
  days,
  currency,
  maxCost,
  onSelectDay,
}: DailyCostChartProps & { maxCost: number }) {
  return (
    <div role="img" aria-label={getSummary(days)} className="h-64 w-full">
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
          <YAxis hide domain={maxCost > 0 ? [0, maxCost] : undefined} />
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

export function DailyCostChart({
  days,
  currency,
  onSelectDay,
}: DailyCostChartProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const months = groupByMonth(days);
  const maxCost = Math.max(0, ...days.map((day) => day.estimatedCost ?? 0));

  useEffect(() => {
    const scroller = scrollRef.current;
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  }, [days]);

  return (
    <div
      ref={scrollRef}
      className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {months.map((month) => (
        <section
          key={month.month}
          aria-label={formatYearMonth(month.month)}
          className="flex w-full shrink-0 snap-start flex-col gap-gap-xsmall"
        >
          <p className="text-subtext-small text-text-tertiary">
            {formatYearMonth(month.month)}
            {months.length > 1 && " · 좌우로 넘겨 다른 달을 볼 수 있어요"}
          </p>
          <MonthChart
            days={month.days}
            currency={currency}
            maxCost={maxCost}
            onSelectDay={onSelectDay}
          />
        </section>
      ))}
    </div>
  );
}
