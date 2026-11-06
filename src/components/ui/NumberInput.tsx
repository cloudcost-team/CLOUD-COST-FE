"use client";

import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type NumberInputProps = {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  "aria-label": string;
  className?: string;
};

export function NumberInput({
  value,
  onValueChange,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  "aria-label": ariaLabel,
  className,
}: NumberInputProps) {
  const update = (nextValue: number) =>
    onValueChange(Math.min(max, Math.max(min, nextValue)));

  return (
    <div
      className={cn(
        "flex h-8 w-full items-center rounded-medium border border-border-default bg-background-default focus-within:border-border-brand focus-within:ring-2 focus-within:ring-border-brand/20",
        className,
      )}
    >
      <input
        type="number"
        aria-label={ariaLabel}
        min={min}
        max={max}
        value={value}
        onChange={(event) => update(Number(event.currentTarget.value))}
        className="min-w-0 flex-1 appearance-none bg-transparent px-3 text-subtext-small text-text-primary outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <div className="mr-1 flex items-center gap-1">
        <button
          type="button"
          aria-label={`${ariaLabel} 감소`}
          disabled={value <= min}
          onClick={() => update(value - 1)}
          className="flex size-6 cursor-pointer items-center justify-center rounded-small text-icon-primary outline-none hover:bg-fill-neutral-weak focus-visible:ring-2 focus-visible:ring-border-brand disabled:pointer-events-none disabled:text-icon-tertiary"
        >
          <Icon name="minus" size={16} />
        </button>
        <button
          type="button"
          aria-label={`${ariaLabel} 증가`}
          disabled={value >= max}
          onClick={() => update(value + 1)}
          className="flex size-6 cursor-pointer items-center justify-center rounded-small text-icon-primary outline-none hover:bg-fill-neutral-weak focus-visible:ring-2 focus-visible:ring-border-brand disabled:pointer-events-none disabled:text-icon-tertiary"
        >
          <Icon name="plus" size={16} />
        </button>
      </div>
    </div>
  );
}
