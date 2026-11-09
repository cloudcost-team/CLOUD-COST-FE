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
      <div className="relative h-5 w-full">
        <progress
          value={value - min}
          max={max - min}
          aria-hidden
          className="absolute top-1/2 h-1 w-full -translate-y-1/2 appearance-none overflow-hidden rounded-full bg-fill-neutral-medium [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-fill-brand [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-fill-neutral-medium [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-fill-brand"
        />
        {markerLabel && (
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 h-3 w-1 -translate-x-1/2 -translate-y-1/2 bg-fill-neutral opacity-50"
          />
        )}
        <input
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onValueChange(Number(event.currentTarget.value))}
          className="absolute inset-y-0 -left-[24.1px] h-5 w-[calc(100%+48.2px)] cursor-pointer appearance-none bg-transparent focus-visible:rounded-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-brand [&::-moz-range-thumb]:h-[36.4px] [&::-moz-range-thumb]:w-[48.201px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[url('../assets/slider-thumb.svg')] [&::-moz-range-thumb]:bg-contain [&::-moz-range-thumb]:bg-center [&::-moz-range-thumb]:bg-no-repeat [&::-moz-range-track]:h-1 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:mt-[-16.2px] [&::-webkit-slider-thumb]:h-[36.4px] [&::-webkit-slider-thumb]:w-[48.201px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[url('../assets/slider-thumb.svg')] [&::-webkit-slider-thumb]:bg-contain [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat"
          {...rest}
        />
      </div>
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
