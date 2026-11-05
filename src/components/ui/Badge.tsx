import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone =
  "neutral" | "brand" | "info" | "success" | "warning" | "danger";

type BadgeProps = {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
};

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-fill-neutral-weak text-text-secondary",
  brand: "bg-fill-brand-weak text-text-brand",
  info: "bg-fill-sky-weak text-text-primary",
  success: "bg-fill-mint-weak text-text-success",
  warning: "bg-fill-warning-weak text-text-warning",
  danger: "bg-fill-danger-weak text-text-danger",
};

export function Badge({ tone = "neutral", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center justify-center rounded-small px-padding-xsmall text-subtext-medium-strong whitespace-nowrap",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
