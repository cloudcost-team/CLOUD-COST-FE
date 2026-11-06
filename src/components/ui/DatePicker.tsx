"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import { Calendar } from "./Calendar";
import { Icon } from "./Icon";

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  "aria-label": string;
  className?: string;
};

export function DatePicker({
  value,
  onChange,
  min,
  max,
  "aria-label": ariaLabel,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseISO(value) : undefined;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className={cn(
            "flex h-14 w-full cursor-pointer items-center justify-between rounded-xlarge bg-fill-neutral-weak px-4 text-left text-subtext-medium text-text-strong outline-none",
            "transition-colors hover:bg-fill-neutral-medium focus-visible:ring-2 focus-visible:ring-border-brand",
            className,
          )}
        >
          <span>
            {selected
              ? format(selected, "yyyy. MM. dd.", { locale: ko })
              : "날짜 선택"}
          </span>
          <Icon name="calendar" size={16} className="text-icon-primary" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          align="start"
          className="z-50 rounded-large border border-border-default bg-background-floated shadow-strong outline-none"
        >
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            disabled={[
              ...(min ? [{ before: parseISO(min) }] : []),
              ...(max ? [{ after: parseISO(max) }] : []),
            ]}
            onSelect={(date) => {
              if (!date) return;
              onChange(format(date, "yyyy-MM-dd"));
              setOpen(false);
            }}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
