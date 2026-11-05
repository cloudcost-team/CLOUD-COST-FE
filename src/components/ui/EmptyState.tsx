import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { Icon } from "./Icon";
import type { IconName } from "./iconPaths";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: IconName;
  action?: { label: string; onClick: () => void };
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon = "file-text",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-gap-medium px-spacing-medium py-spacing-large text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-fill-neutral-weak">
        <Icon name={icon} className="text-icon-tertiary" />
      </span>
      <div className="flex flex-col items-center gap-gap-xsmall">
        <p className="text-title-xsmall text-text-strong">{title}</p>
        {description && (
          <p className="text-body-xsmall text-text-tertiary">{description}</p>
        )}
      </div>
      {action && (
        <Button variant="assistive" size="medium" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
