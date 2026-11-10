"use client";

import { Bar, BarChart, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/cn";

export type DistributionBars = {
  values: number[];
  oursIndex: number | null;
  afterIndex: number | null;
};

type DistributionChartProps = {
  bars: DistributionBars;
  showAfter: boolean;
  className?: string;
};

function barColors(index: number, bars: DistributionBars, showAfter: boolean) {
  if (showAfter && index === bars.afterIndex)
    return {
      fill: "transparent",
      stroke: "var(--color-border-brand)",
      strokeWidth: 1.5,
      strokeDasharray: "4 3",
    };
  if (index === bars.oursIndex) return { fill: "var(--color-fill-brand)" };
  return { fill: "var(--color-fill-neutral-weak)" };
}

export function DistributionChart({
  bars,
  showAfter,
  className,
}: DistributionChartProps) {
  const data = bars.values.map((value, index) => ({ index, value }));

  return (
    <div className={cn("flex min-w-0 flex-col gap-gap-small", className)}>
      <div
        role="img"
        aria-label="비교 팀 과다 사양 비율 분포와 우리 팀 위치"
        className="h-30 w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            barCategoryGap={2}
          >
            <Bar
              dataKey="value"
              radius={[3, 3, 0, 0]}
              isAnimationActive={false}
            >
              {data.map((bar) => (
                <Cell
                  key={bar.index}
                  {...barColors(bar.index, bars, showAfter)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-start justify-between text-subtext-small">
        <span className="text-text-quaternary">0%</span>
        <span className="flex items-center gap-gap-xsmall text-text-secondary">
          <span className="size-2 rounded-[2px] bg-fill-brand" />
          {showAfter ? "우리 팀 (현재)" : "우리 팀"}
          {showAfter && (
            <>
              <span className="size-2 rounded-[2px] border border-dashed border-border-brand" />
              적용 후
            </>
          )}
        </span>
        <span className="text-text-quaternary">100%</span>
      </div>
    </div>
  );
}
