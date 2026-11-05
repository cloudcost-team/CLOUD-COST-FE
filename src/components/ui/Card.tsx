import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  title?: string;
  meta?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function Card({ title, meta, action, className, children }: CardProps) {
  const titleId = useId();
  const hasHeader = Boolean(title || meta || action);
  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      className={cn(
        "flex flex-col gap-gap-large rounded-xlarge border border-border-default bg-background-floated p-padding-xlarge",
        className,
      )}
    >
      {hasHeader && (
        <div className="flex items-center gap-gap-small">
          {title && (
            <h2 id={titleId} className="text-title-small text-text-strong">
              {title}
            </h2>
          )}
          {meta && (
            <span className="text-subtext-large text-text-tertiary">
              {meta}
            </span>
          )}
          {action && (
            <div className="ml-auto flex shrink-0 items-center gap-gap-small">
              {action}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
