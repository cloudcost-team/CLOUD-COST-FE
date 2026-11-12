import type { CSSProperties } from "react";
import type { BenchmarkSpendPosition } from "./BenchmarkScreen";
import { OursMarker } from "./OursMarker";

const RANGE_START = 25;
const RANGE_END = 75;

function markerPosition(
  position: BenchmarkSpendPosition,
  barPositionPercent: number,
) {
  if (position === "BELOW") return RANGE_START - 5;
  if (position === "ABOVE") return RANGE_END + 5;
  return RANGE_START + (barPositionPercent * (RANGE_END - RANGE_START)) / 100;
}

type RangeBarProps = {
  position: BenchmarkSpendPosition;
  barPositionPercent: number;
  markerLabel: string;
  startLabel: string;
  endLabel: string;
  caption: string;
};

export function RangeBar({
  position,
  barPositionPercent,
  markerLabel,
  startLabel,
  endLabel,
  caption,
}: RangeBarProps) {
  return (
    <div
      className="flex min-w-0 flex-col gap-gap-small"
      style={
        {
          "--range-start": `${RANGE_START}%`,
          "--range-end": `${100 - RANGE_END}%`,
        } as CSSProperties
      }
    >
      <div className="flex flex-col">
        <OursMarker
          position={markerPosition(position, barPositionPercent)}
          label={markerLabel}
        />
        <div
          role="img"
          aria-label={`일반 범위 ${startLabel}~${endLabel} 기준 ${markerLabel}`}
          className="relative h-4 overflow-hidden rounded-full bg-fill-neutral-weak"
        >
          <div className="absolute inset-y-0 right-(--range-end) left-(--range-start) bg-fill-brand" />
        </div>
      </div>
      <div className="relative h-5 text-subtext-small text-text-tertiary">
        <span className="absolute left-0">낮음</span>
        <span className="absolute left-(--range-start) -translate-x-1/2">
          {startLabel}
        </span>
        <span className="absolute left-1/2 -translate-x-1/2 text-text-brand">
          일반
        </span>
        <span className="absolute right-(--range-end) translate-x-1/2">
          {endLabel}
        </span>
        <span className="absolute right-0">높음</span>
      </div>
      <p className="text-subtext-medium text-text-tertiary">{caption}</p>
    </div>
  );
}
