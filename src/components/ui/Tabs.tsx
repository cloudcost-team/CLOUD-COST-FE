"use client";

import { useId, type KeyboardEvent, type ReactNode } from "react";
import { getArrowKeyIndex } from "@/lib/arrowKeyIndex";
import { cn } from "@/lib/cn";

export type TabItem<T extends string> = {
  value: T;
  label: string;
  content: ReactNode;
};

type TabsProps<T extends string> = {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label"?: string;
  className?: string;
};

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: TabsProps<T>) {
  const baseId = useId();
  const selectedIndex = Math.max(
    items.findIndex((item) => item.value === value),
    0,
  );
  const selectedItem = items[selectedIndex];

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const nextIndex = getArrowKeyIndex(event.key, selectedIndex, items.length);
    if (nextIndex === null) return;
    event.preventDefault();
    onChange(items[nextIndex].value);
    const tabs = event.currentTarget.parentElement?.children;
    (tabs?.[nextIndex] as HTMLElement | undefined)?.focus();
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex h-11 gap-gap-xlarge border-b border-border-weak"
      >
        {items.map((item, index) => {
          const selected = index === selectedIndex;
          return (
            <button
              key={item.value}
              id={`${baseId}-tab-${item.value}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(item.value)}
              onKeyDown={handleKeyDown}
              className={cn(
                "relative h-11 cursor-pointer px-padding-xxsmall text-label-small whitespace-nowrap transition-colors",
                "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-brand",
                selected
                  ? "text-text-strong after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-border-brand"
                  : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {selectedItem && (
        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${selectedItem.value}`}
          tabIndex={0}
          className="focus-visible:outline-2 focus-visible:outline-border-brand"
        >
          {selectedItem.content}
        </div>
      )}
    </div>
  );
}
