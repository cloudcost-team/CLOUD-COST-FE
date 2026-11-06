import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type SliderProps = Omit<
  ComponentProps<"input">,
  "type" | "value" | "onChange" | "min" | "max" | "step"
> & {
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
  minLabel?: ReactNode;
  markerLabel?: ReactNode;
  maxLabel?: ReactNode;
};

export function Slider({
  value,
  min,
  max,
  step,
  onValueChange,
  minLabel,
  markerLabel,
  maxLabel,
  className,
  ...rest
}: SliderProps) {
  const hasLabels = Boolean(minLabel || markerLabel || maxLabel);
  return (
    <div className={cn("flex flex-col gap-gap-small", className)}>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onValueChange(Number(event.currentTarget.value))}
        className="h-5 w-full cursor-pointer accent-fill-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-brand"
        {...rest}
      />
      {hasLabels && (
        <div className="flex items-start justify-between gap-gap-small text-subtext-small">
          <span className="text-text-tertiary">{minLabel}</span>
          {markerLabel && (
            <span className="text-text-secondary">{markerLabel}</span>
          )}
          <span className="text-text-tertiary">{maxLabel}</span>
        </div>
      )}
    </div>
  );
}
