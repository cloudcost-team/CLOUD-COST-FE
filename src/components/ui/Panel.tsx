import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type PanelVariant =
  | "subtle"
  | "brand"
  | "mint"
  | "warning"
  | "danger"
  | "outline"
  | "outline-brand"
  | "dashed";

type PanelSize = "medium" | "large";

type PanelProps = {
  as?: "div" | "section" | "p" | "ul" | "ol" | "li";
  variant?: PanelVariant;
  size?: PanelSize;
  className?: string;
  children: ReactNode;
};

const variantClasses: Record<PanelVariant, string> = {
  subtle: "bg-background-lower",
  brand: "bg-fill-brand-weak",
  mint: "bg-fill-mint-weak",
  warning: "bg-fill-warning-weak",
  danger: "bg-fill-danger-weak",
  outline: "border border-border-default",
  "outline-brand": "border border-border-brand",
  dashed: "border border-dashed border-border-default",
};

const sizeClasses: Record<PanelSize, string> = {
  medium: "p-padding-medium",
  large: "p-padding-large",
};

export function Panel({
  as: Component = "div",
  variant = "subtle",
  size = "large",
  className,
  children,
}: PanelProps) {
  return (
    <Component
      className={cn(
        "rounded-large",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </Component>
  );
}
