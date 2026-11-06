"use client";

import type { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "react-day-picker/locale";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

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
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-3",
        month_caption: "relative flex h-8 items-center justify-center",
        caption_label: "text-label-xsmall text-text-strong",
        nav: "absolute inset-x-4 top-4 flex h-8 items-center justify-between",
        button_previous:
          "z-10 flex size-8 cursor-pointer items-center justify-center rounded-medium text-icon-primary outline-none hover:bg-fill-neutral-weak focus-visible:ring-2 focus-visible:ring-border-brand",
        button_next:
          "z-10 ml-auto flex size-8 cursor-pointer items-center justify-center rounded-medium text-icon-primary outline-none hover:bg-fill-neutral-weak focus-visible:ring-2 focus-visible:ring-border-brand",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "flex size-8 items-center justify-center text-subtext-small text-text-tertiary",
        week: "mt-1 flex w-full",
        day: "relative size-8 p-0 text-center",
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
        Chevron: ({ orientation }) => (
          <Icon
            name={orientation === "left" ? "chevron-left" : "chevron-right"}
            size={16}
          />
        ),
      }}
      {...props}
    />
  );
}
