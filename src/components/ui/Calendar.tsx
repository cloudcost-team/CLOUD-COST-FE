"use client";

import { useState, type ChangeEvent, type ComponentProps } from "react";
import { DayPicker, type DropdownProps } from "react-day-picker";
import { ko } from "react-day-picker/locale";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";

function CalendarDropdown({
  options = [],
  value,
  onChange,
  disabled,
  "aria-label": ariaLabel,
}: DropdownProps) {
  const [container, setContainer] = useState<HTMLSpanElement | null>(null);

  function changeValue(next: string) {
    onChange?.({ target: { value: next } } as ChangeEvent<HTMLSelectElement>);
  }

  return (
    <span ref={setContainer}>
      <Select
        value={String(value)}
        disabled={disabled}
        onValueChange={changeValue}
      >
        <SelectTrigger
          aria-label={ariaLabel}
          className="w-auto gap-gap-xxsmall px-padding-xsmall text-label-xsmall text-text-strong"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent container={container}>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={String(option.value)}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </span>
  );
}

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={ko}
      className={cn("relative", className)}
      classNames={{
        months: "flex flex-col",
        month: "w-full space-y-3",
        month_caption: "flex h-8 items-center",
        caption_label:
          "flex items-center gap-gap-xxsmall text-label-xsmall text-text-strong",
        dropdowns: "flex items-center gap-gap-xsmall",
        nav: "absolute top-0 right-0 flex h-8 items-center gap-gap-xxsmall",
        button_previous:
          "z-10 flex size-8 cursor-pointer items-center justify-center rounded-medium text-icon-primary outline-none hover:bg-fill-neutral-weak focus-visible:ring-2 focus-visible:ring-border-brand",
        button_next:
          "z-10 flex size-8 cursor-pointer items-center justify-center rounded-medium text-icon-primary outline-none hover:bg-fill-neutral-weak focus-visible:ring-2 focus-visible:ring-border-brand",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "flex h-8 flex-1 items-center justify-center text-subtext-small text-text-tertiary",
        week: "mt-1 flex w-full",
        day: "relative flex flex-1 justify-center p-0",
        day_button:
          "size-8 cursor-pointer rounded-medium text-subtext-small text-text-primary outline-none hover:bg-fill-brand-weak hover:text-text-brand focus-visible:ring-2 focus-visible:ring-border-brand",
        selected:
          "[&>button]:bg-fill-brand [&>button]:text-text-on-fill [&>button]:hover:bg-fill-brand-strong [&>button]:hover:text-text-on-fill",
        today:
          "[&>button]:font-semibold [&>button]:text-text-brand [&>button]:ring-1 [&>button]:ring-border-brand",
        outside: "opacity-35",
        disabled:
          "pointer-events-none opacity-25 [&>button]:cursor-not-allowed",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Dropdown: CalendarDropdown,
        Chevron: ({ orientation = "right" }) => (
          <Icon name={`chevron-${orientation}`} size={16} />
        ),
      }}
      {...props}
    />
  );
}
