"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { getArrowKeyIndex } from "@/lib/arrowKeyIndex";
import { cn } from "@/lib/cn";
import { InteractionOverlay } from "./InteractionOverlay";

export type SegmentedControlOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
  className?: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0,
  );
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties | null>(
    null,
  );

  useLayoutEffect(() => {
    const button = buttonRefs.current[selectedIndex];
    if (!button) return;
    const measure = () =>
      setIndicatorStyle({
        left: button.offsetLeft,
        top: button.offsetTop,
        width: button.offsetWidth,
        height: button.offsetHeight,
      });
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(button);
    return () => observer.disconnect();
  }, [selectedIndex]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const nextIndex = getArrowKeyIndex(
      event.key,
      selectedIndex,
      options.length,
    );
    if (nextIndex === null) return;
    event.preventDefault();
    onChange(options[nextIndex].value);
    const buttons = event.currentTarget.parentElement?.children;
    (buttons?.[nextIndex] as HTMLElement | undefined)?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "relative inline-flex gap-gap-xxsmall rounded-large bg-fill-neutral-weak p-padding-xxsmall",
        className,
      )}
    >
      {indicatorStyle && (
        <span
          aria-hidden
          className="absolute rounded-medium bg-background-default shadow-weak transition-[left,width] duration-200 ease-out motion-reduce:transition-none"
          style={indicatorStyle}
        />
      )}
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={index === selectedIndex ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "group relative h-8 cursor-pointer rounded-medium px-padding-small text-label-xsmall whitespace-nowrap transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand",
              selected ? "text-text-strong" : "text-text-tertiary",
              selected &&
                !indicatorStyle &&
                "bg-background-default shadow-weak",
            )}
          >
            {!selected && <InteractionOverlay tone="neutral" />}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
