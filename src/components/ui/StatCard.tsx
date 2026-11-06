import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "./Badge";

type StatCardSize = "medium" | "small";

type StatCardProps = {
  label: string;
  value: ReactNode;
  caption?: ReactNode;
  estimated?: boolean;
  size?: StatCardSize;
  className?: string;
};

const sizeClasses: Record<
  StatCardSize,
  { root: string; label: string; value: string }
> = {
  medium: {
    root: "gap-gap-small rounded-xlarge bg-background-floated",
    label: "text-subtext-medium",
    value: "text-display-small",
  },
  small: {
    root: "gap-gap-xsmall rounded-large",
    label: "text-subtext-small",
    value: "text-title-small",
  },
};

export function StatCard({
  label,
  value,
  caption,
  estimated = false,
  size = "medium",
  className,
}: StatCardProps) {
  const sizeClass = sizeClasses[size];
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col border border-border-default p-padding-large",
        sizeClass.root,
        className,
      )}
    >
      <div className="flex items-center gap-gap-xsmall">
        <p className={cn("text-text-tertiary", sizeClass.label)}>{label}</p>
        {estimated && <Badge>추정</Badge>}
      </div>
      <p className={cn("break-words text-text-strong", sizeClass.value)}>
        {value}
      </p>
      {caption && (
        <p className="text-subtext-medium text-text-tertiary">{caption}</p>
      )}
    </div>
  );
}
