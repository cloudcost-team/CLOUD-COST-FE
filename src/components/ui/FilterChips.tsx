"use client";

import type { KeyboardEvent } from "react";
import { getArrowKeyIndex } from "@/lib/arrowKeyIndex";
import { cn } from "@/lib/cn";

export type FilterChipOption<T extends string> = {
  value: T;
  label: string;
};

type FilterChipsProps<T extends string> = {
  options: FilterChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
  className?: string;
};

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: FilterChipsProps<T>) {
  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0,
  );

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const nextIndex = getArrowKeyIndex(
      event.key,
      selectedIndex,
      options.length,
    );
    if (nextIndex === null) return;
    event.preventDefault();
    onChange(options[nextIndex].value);
    const buttons =
      event.currentTarget.parentElement?.querySelectorAll("button");
    buttons?.[nextIndex]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap gap-gap-small", className)}
    >
      {options.map((option, index) => {
        const selected = index === selectedIndex;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "h-9 cursor-pointer rounded-full px-padding-medium text-label-xsmall-weak transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand",
              selected
                ? "bg-fill-neutral text-text-on-fill"
                : "border border-border-default bg-background-default text-text-secondary hover:bg-background-lower",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
