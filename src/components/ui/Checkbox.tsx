"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type CheckboxProps = Omit<ComponentProps<"input">, "type" | "size"> & {
  label?: string;
  indeterminate?: boolean;
};

export function Checkbox({
  label,
  indeterminate = false,
  disabled,
  className,
  ...rest
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-gap-small",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <span className="relative inline-flex size-5 shrink-0">
        <input
          type="checkbox"
          ref={(element) => {
            if (element) element.indeterminate = indeterminate;
          }}
          disabled={disabled}
          className={cn(
            "peer size-5 cursor-[inherit] appearance-none rounded-small border-[1.5px] border-border-strong bg-background-default",
            "checked:border-0 checked:bg-fill-brand indeterminate:border-0 indeterminate:bg-fill-brand",
            "disabled:border-border-default disabled:bg-fill-neutral-weak disabled:checked:bg-fill-neutral-medium disabled:indeterminate:bg-fill-neutral-medium",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand",
          )}
          {...rest}
        />
        <Icon
          name={indeterminate ? "minus" : "check"}
          size={16}
          className="pointer-events-none absolute inset-0.5 hidden text-icon-on-fill peer-checked:block peer-indeterminate:block"
        />
      </span>
      {label && (
        <span
          className={cn(
            "text-subtext-medium",
            disabled ? "text-text-quaternary" : "text-text-primary",
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
}
