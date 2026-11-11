"use client";

import type { ComponentProps } from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export function Select(props: ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />;
}

export function SelectValue(
  props: ComponentProps<typeof SelectPrimitive.Value>,
) {
  return <SelectPrimitive.Value {...props} />;
}

export function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-8 w-full cursor-pointer items-center justify-between gap-2 rounded-medium border border-border-default bg-background-default px-3 text-subtext-small text-text-primary outline-none",
        "transition-colors hover:border-border-strong focus:border-border-brand focus:ring-2 focus:ring-border-brand/20",
        "disabled:pointer-events-none disabled:bg-fill-neutral-weak disabled:text-text-quaternary",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <Icon name="chevron-down" size={16} className="text-icon-primary" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 4,
  container,
  ...props
}: ComponentProps<typeof SelectPrimitive.Content> & {
  container?: HTMLElement | null;
}) {
  return (
    <SelectPrimitive.Portal container={container}>
      <SelectPrimitive.Content
        position={position}
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-h-60 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-large border border-border-default bg-background-floated p-1 shadow-strong",
          "data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex h-8 cursor-pointer select-none items-center rounded-medium py-1 pr-3 pl-8 text-subtext-small text-text-primary outline-none",
        "data-[disabled]:pointer-events-none data-[disabled]:text-text-quaternary data-[highlighted]:bg-fill-brand-weak data-[highlighted]:text-text-brand",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center text-icon-brand">
        <SelectPrimitive.ItemIndicator>
          <Icon name="check" size={16} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
