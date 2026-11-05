import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import type { IconName } from "./iconPaths";
import { InteractionOverlay } from "./InteractionOverlay";

type IconButtonProps = Omit<
  ComponentProps<"button">,
  "children" | "aria-label"
> & {
  icon: IconName;
  "aria-label": string;
  variant?: "ghost" | "weak";
  size?: "small" | "medium";
};

const sizeClasses = {
  small:
    "size-8 before:absolute before:-inset-1 before:rounded-[inherit] before:content-['']",
  medium: "size-10",
};

export function IconButton({
  icon,
  variant = "ghost",
  size = "small",
  disabled = false,
  type = "button",
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "group relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-medium transition-transform",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand",
        "active:scale-95 disabled:pointer-events-none",
        variant === "weak" && "bg-fill-neutral-weak",
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {!disabled && <InteractionOverlay tone="neutral" />}
      <Icon
        name={icon}
        className={cn(
          "relative",
          disabled ? "text-icon-tertiary" : "text-icon-primary",
        )}
      />
    </button>
  );
}
