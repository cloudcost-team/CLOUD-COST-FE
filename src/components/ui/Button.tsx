import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  buttonBaseClasses,
  buttonSizeClasses,
  buttonVariantClasses,
  type ButtonSize,
  type ButtonVariant,
} from "./buttonStyles";
import { Icon } from "./Icon";
import type { IconName } from "./iconPaths";
import { InteractionOverlay } from "./InteractionOverlay";
import { LoadingDots } from "./LoadingDots";

export type { ButtonSize, ButtonVariant } from "./buttonStyles";

type ButtonProps = Omit<ComponentProps<"button">, "children"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  loading?: boolean;
  children: ReactNode;
};

const disabledClasses = {
  container: "bg-fill-neutral-weak text-text-quaternary",
  icon: "text-icon-tertiary",
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
  const colors = looksDisabled
    ? disabledClasses
    : buttonVariantClasses[variant];
  const sizes = buttonSizeClasses[size];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        buttonBaseClasses,
        "disabled:pointer-events-none",
        sizes.container,
        colors.container,
        className,
      )}
      {...rest}
    >
      {!looksDisabled && (
        <InteractionOverlay tone={buttonVariantClasses[variant].overlay} />
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
          dotClassName={buttonVariantClasses[variant].dot}
          className="absolute"
        />
      )}
    </button>
  );
}
