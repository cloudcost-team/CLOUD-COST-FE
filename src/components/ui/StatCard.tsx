import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "./Badge";

type StatCardProps = {
  label: string;
  value: ReactNode;
  caption?: ReactNode;
  estimated?: boolean;
  className?: string;
};

export function StatCard({
  label,
  value,
  caption,
  estimated = false,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-gap-small rounded-xlarge border border-border-default bg-background-floated p-padding-large",
        className,
      )}
    >
      <div className="flex items-center gap-gap-xsmall">
        <p className="text-subtext-medium text-text-tertiary">{label}</p>
        {estimated && <Badge>추정</Badge>}
      </div>
      <p className="text-display-small break-words text-text-strong">{value}</p>
      {caption && (
        <p className="text-subtext-medium text-text-tertiary">{caption}</p>
      )}
    </div>
  );
}
