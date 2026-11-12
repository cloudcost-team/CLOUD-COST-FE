"use client";

import type { CSSProperties } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, YAxis } from "recharts";
import { cn } from "@/lib/cn";
import { OursMarker } from "./OursMarker";

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
  return { fill: "var(--color-fill-neutral-medium)" };
}

export function DistributionChart({
  bars,
  showAfter,
  className,
}: DistributionChartProps) {
  const data = bars.values.map((value, index) => ({ index, value }));
  const columns = {
    "--bar-count": `repeat(${bars.values.length}, minmax(0, 1fr))`,
  } as CSSProperties;

  return (
    <div
      className={cn("flex min-w-0 flex-col gap-gap-small", className)}
      style={columns}
    >
      <div className="grid grid-cols-(--bar-count)">
        {bars.values.map((_, index) => (
          <div key={index} className="flex justify-center">
            {index === bars.oursIndex && <OursMarker pointer={false} />}
          </div>
        ))}
      </div>
      <div
        role="img"
        aria-label="비교 팀 과다 사양 비율 분포와 우리 팀 위치"
        className="h-36 w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            barCategoryGap={2}
          >
            <YAxis hide domain={[0, "dataMax"]} />
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
      {showAfter && bars.afterIndex !== null && (
        <div className="grid grid-cols-(--bar-count) text-label-xsmall">
          {bars.values.map((_, index) => (
            <span key={index} className="flex justify-center whitespace-nowrap">
              {index === bars.afterIndex && (
                <span className="text-text-secondary">↑ 적용 후</span>
              )}
            </span>
          ))}
        </div>
      )}
      <div className="flex justify-between text-subtext-small text-text-quaternary">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
