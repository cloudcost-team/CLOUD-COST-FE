import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import type { IconName } from "./iconPaths";
import {
  InteractionOverlay,
  type InteractionOverlayTone,
} from "./InteractionOverlay";
import { LoadingDots } from "./LoadingDots";

export type ButtonVariant = "primary" | "secondary" | "assistive" | "danger";
export type ButtonSize = "large" | "medium" | "small";

type ButtonProps = Omit<ComponentProps<"button">, "children"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  loading?: boolean;
  children: ReactNode;
};

const variantClasses: Record<
  ButtonVariant,
  {
    container: string;
    icon: string;
    overlay: InteractionOverlayTone;
    dot: string;
  }
> = {
  primary: {
    container: "bg-fill-brand text-text-on-fill",
    icon: "text-icon-on-fill",
    overlay: "onFill",
    dot: "bg-fill-default",
  },
  secondary: {
    container: "bg-fill-brand-weak text-text-brand",
    icon: "text-icon-brand",
    overlay: "brand",
    dot: "bg-fill-brand",
  },
  assistive: {
    container: "bg-fill-neutral-weak text-text-secondary",
    icon: "text-icon-default",
    overlay: "neutral",
    dot: "bg-fill-neutral",
  },
  danger: {
    container: "bg-fill-danger text-text-on-fill",
    icon: "text-icon-on-fill",
    overlay: "onFill",
    dot: "bg-fill-default",
  },
};

const disabledClasses = {
  container: "bg-fill-neutral-weak text-text-quaternary",
  icon: "text-icon-tertiary",
};

const sizeClasses: Record<
  ButtonSize,
  { container: string; iconSize: 16 | 20; dots: "large" | "small" }
> = {
  large: {
    container: "h-12 rounded-large px-padding-large text-label-small",
    iconSize: 20,
    dots: "large",
  },
  medium: {
    container: "h-10 rounded-medium px-padding-medium text-label-xsmall",
    iconSize: 20,
    dots: "large",
  },
  small: {
    container:
      "h-8 rounded-medium px-padding-small text-label-xsmall before:absolute before:inset-x-0 before:-inset-y-1 before:content-['']",
    iconSize: 16,
    dots: "small",
  },
};

export function Button({
  variant = "primary",
  size = "large",
  icon,
  loading = false,
  disabled = false,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  const looksDisabled = disabled && !loading;
  const colors = looksDisabled ? disabledClasses : variantClasses[variant];
  const sizes = sizeClasses[size];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "group relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap transition-transform",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand",
        "active:scale-95 disabled:pointer-events-none",
        sizes.container,
        colors.container,
        className,
      )}
      {...rest}
    >
      {!looksDisabled && (
        <InteractionOverlay tone={variantClasses[variant].overlay} />
      )}
      <span
        className={cn(
          "relative inline-flex items-center gap-gap-xsmall",
          loading && "invisible",
        )}
      >
        {children}
        {icon && (
          <Icon name={icon} size={sizes.iconSize} className={colors.icon} />
        )}
      </span>
      {loading && (
        <LoadingDots
          size={sizes.dots}
          dotClassName={variantClasses[variant].dot}
          className="absolute"
        />
      )}
    </button>
  );
}
