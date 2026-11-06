import Link from "next/link";
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

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "children"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  external?: boolean;
  children: ReactNode;
};

export function ButtonLink({
  variant = "primary",
  size = "large",
  icon,
  external = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const colors = buttonVariantClasses[variant];
  const sizes = buttonSizeClasses[size];

  return (
    <Link
      className={cn(
        buttonBaseClasses,
        sizes.container,
        colors.container,
        className,
      )}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      {...rest}
    >
      <InteractionOverlay tone={colors.overlay} />
      <span className="relative inline-flex items-center gap-gap-xsmall">
        {children}
        {icon && (
          <Icon name={icon} size={sizes.iconSize} className={colors.icon} />
        )}
      </span>
    </Link>
  );
}
