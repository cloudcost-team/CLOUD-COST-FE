import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type SwitchProps = Omit<ComponentProps<"button">, "onChange" | "role"> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  className,
  ...rest
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand",
        "disabled:cursor-not-allowed disabled:opacity-45",
        checked ? "bg-fill-brand" : "bg-fill-neutral-medium",
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden
        className={cn(
          "size-5 rounded-full bg-fill-default shadow-weak transition-transform",
          checked && "translate-x-4",
        )}
      />
    </button>
  );
}
