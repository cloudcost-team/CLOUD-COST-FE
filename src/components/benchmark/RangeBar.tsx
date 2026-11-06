"use client";

import {
  Bar,
  BarChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/cn";

export type SpendScale = {
  rangeStart: number;
  rangeEnd: number;
  marker: number;
  afterMarker: number | null;
  startLabel: string;
  endLabel: string;
  oursLabel: string;
  afterLabel: string | null;
};

type RangeBarProps = {
  scale: SpendScale;
  rangeLabel: string;
  showAfter: boolean;
  className?: string;
};

const trackData = [{ name: "track", value: 0 }];

export function RangeBar({
  scale,
  rangeLabel,
  showAfter,
  className,
}: RangeBarProps) {
  const afterVisible = showAfter && scale.afterMarker !== null;

  return (
    <div className={cn("flex min-w-0 flex-col gap-gap-small", className)}>
      <div
        role="img"
        aria-label={`${rangeLabel} 안에서 우리 팀 위치`}
        className="h-9 w-full overflow-hidden rounded-medium bg-fill-neutral-weak"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={trackData}
            layout="vertical"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />
            <ReferenceArea
              x1={scale.rangeStart}
              x2={scale.rangeEnd}
              fill="var(--color-fill-brand-weak)"
              fillOpacity={1}
              label={{
                value: rangeLabel,
                position: "center",
                fill: "var(--color-text-brand)",
                fontSize: 12,
              }}
            />
            {afterVisible && (
              <ReferenceLine
                x={scale.afterMarker ?? undefined}
                stroke="var(--color-border-brand)"
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
            )}
            <ReferenceLine
              x={scale.marker}
              stroke="var(--color-fill-brand)"
              strokeWidth={3}
            />
            <Bar dataKey="value" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-start justify-between">
        <span className="text-subtext-small text-text-quaternary">
          {scale.startLabel}
        </span>
        <span className="text-label-xsmall text-text-brand">
          ▲ 우리 팀 {scale.oursLabel}
          {afterVisible && scale.afterLabel && ` → ${scale.afterLabel}`}
        </span>
        <span className="text-subtext-small text-text-quaternary">
          {scale.endLabel}
        </span>
      </div>
    </div>
  );
}
