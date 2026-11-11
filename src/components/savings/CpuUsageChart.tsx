"use client";

import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";
import type { WasteCpuChart, WasteMetrics } from "@/api/waste";
import { Panel } from "@/components/ui/Panel";

type CpuUsageChartProps = {
  chart: WasteCpuChart;
  metrics: WasteMetrics;
};

const kstHourFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  hourCycle: "h23",
});

function getKstParts(isoString: string) {
  const parts = kstHourFormat.formatToParts(new Date(isoString));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return { monthDay: `${get("month")}/${get("day")}`, hour: get("hour") };
}

function formatKstMonthDayHour(isoString: string) {
  const { monthDay, hour } = getKstParts(isoString);
  return `${monthDay} ${Number(hour)}시`;
}

function getYMax(dataMax: number, baseline: number | null) {
  return Math.max(dataMax, baseline ?? 0) * 1.5;
}

const metricItems = [
  { key: "cpuAvg", label: "평균" },
  { key: "cpuP95", label: "P95" },
  { key: "cpuMax", label: "최대" },
] as const;

export function CpuUsageChart({ chart, metrics }: CpuUsageChartProps) {
  const first = chart.points[0];
  const last = chart.points.at(-1);

  return (
    <Panel variant="outline" className="flex flex-col gap-gap-medium">
      <div className="h-30 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chart.points}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <YAxis
              hide
              domain={[
                0,
                (dataMax: number) => getYMax(dataMax, chart.baselinePercent),
              ]}
            />
            {chart.baselinePercent !== null && (
              <ReferenceLine
                y={chart.baselinePercent}
                stroke="var(--color-border-strong)"
                strokeDasharray="4 4"
              />
            )}
            <Tooltip
              formatter={(value) => [`${value}%`, "평균 CPU"]}
              labelFormatter={(_, payload) => {
                const hour = payload?.[0]?.payload?.hour;
                return typeof hour === "string"
                  ? formatKstMonthDayHour(hour)
                  : "";
              }}
            />
            <Line
              type="linear"
              dataKey="avg"
              stroke="var(--color-fill-brand)"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-gap-small text-subtext-small whitespace-nowrap">
        <span className="text-text-quaternary">
          {first && getKstParts(first.hour).monthDay}
        </span>
        <span className="text-text-secondary">
          최대 {chart.max}% · {formatKstMonthDayHour(chart.maxAt)}
        </span>
        {chart.baselineLabel && (
          <span className="text-text-quaternary">
            점선 = {chart.baselineLabel}
          </span>
        )}
        <span className="text-text-quaternary">
          {last && getKstParts(last.hour).monthDay}
        </span>
      </div>
      <dl className="flex gap-spacing-medium">
        {metricItems.map((metric) => (
          <div key={metric.key} className="flex flex-col gap-gap-xxsmall">
            <dt className="text-subtext-small text-text-quaternary">
              {metric.label}
            </dt>
            <dd className="text-label-medium text-text-strong">
              {Math.round(metrics[metric.key])}%
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
