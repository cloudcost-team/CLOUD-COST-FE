import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import type { IconName } from "./iconPaths";
import { InteractionOverlay } from "./InteractionOverlay";

type TextLinkProps = ComponentProps<typeof Link> & {
  tone?: "brand" | "neutral";
  icon?: IconName | null;
  iconPosition?: "right" | "left";
};

const toneClasses = {
  brand: { text: "text-text-brand", icon: "text-icon-brand" },
  neutral: { text: "text-text-secondary", icon: "text-icon-secondary" },
};

export function TextLink({
  tone = "brand",
  icon = "chevron-right",
  iconPosition = "right",
  className,
  children,
  ...rest
}: TextLinkProps) {
  const colors = toneClasses[tone];
  const iconElement = icon && (
    <Icon
      name={icon}
      size={16}
      className={cn(
        "relative",
        colors.icon,
        iconPosition === "left" && "-scale-x-100",
      )}
    />
  );

  return (
    <Link
      className={cn(
        "group relative inline-flex items-center gap-gap-xxsmall rounded-xsmall whitespace-nowrap text-label-xsmall transition-transform",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand",
        "active:scale-95",
        "before:absolute before:inset-x-0 before:top-1/2 before:h-10 before:-translate-y-1/2 before:content-['']",
        colors.text,
        className,
      )}
      {...rest}
    >
      <InteractionOverlay tone="neutral" />
      {iconPosition === "left" && iconElement}
      <span className="relative">{children}</span>
      {iconPosition === "right" && iconElement}
    </Link>
  );
}
