import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import type { IconName } from "./iconPaths";
import { InteractionOverlay } from "./InteractionOverlay";

type TextButtonProps = ComponentProps<"button"> & {
  tone?: "brand" | "neutral";
  icon?: IconName;
};

const toneClasses = {
  brand: { text: "text-text-brand", icon: "text-icon-brand" },
  neutral: { text: "text-text-secondary", icon: "text-icon-secondary" },
};

export function TextButton({
  tone = "neutral",
  icon,
  type = "button",
  className,
  children,
  ...rest
}: TextButtonProps) {
  const colors = toneClasses[tone];
  return (
    <button
      type={type}
      className={cn(
        "group relative inline-flex cursor-pointer items-center gap-gap-xxsmall rounded-xsmall whitespace-nowrap text-label-xsmall transition-transform",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand",
        "active:scale-95 disabled:pointer-events-none disabled:opacity-45",
        "before:absolute before:inset-x-0 before:top-1/2 before:h-10 before:-translate-y-1/2 before:content-['']",
        colors.text,
        className,
      )}
      {...rest}
    >
      <InteractionOverlay tone="neutral" />
      <span className="relative">{children}</span>
      {icon && (
        <Icon name={icon} size={16} className={cn("relative", colors.icon)} />
      )}
    </button>
  );
}
