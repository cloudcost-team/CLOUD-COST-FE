import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-end gap-gap-large", className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-gap-small">
        <h1 className="text-display-small break-words text-text-strong">
          {title}
        </h1>
        {description && (
          <p className="text-body-medium text-text-tertiary">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-gap-small">
          {actions}
        </div>
      )}
    </div>
  );
}
