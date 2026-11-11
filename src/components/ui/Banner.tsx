import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { Icon } from "./Icon";
import type { IconName } from "./iconPaths";

export type BannerTone = "danger" | "warning" | "info";

type BannerProps = {
  tone?: BannerTone;
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
  className?: string;
};

const toneClasses: Record<
  BannerTone,
  { container: string; icon: IconName; iconColor: string }
> = {
  danger: {
    container: "bg-fill-danger-weak",
    icon: "alert-circle",
    iconColor: "text-icon-danger",
  },
  warning: {
    container: "bg-fill-warning-weak",
    icon: "alert-triangle",
    iconColor: "text-icon-warning",
  },
  info: {
    container: "bg-fill-brand-weak",
    icon: "info",
    iconColor: "text-icon-brand",
  },
};

export function Banner({
  tone = "danger",
  title,
  description,
  icon,
  action,
  className,
}: BannerProps) {
  const styles = toneClasses[tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "flex items-center gap-gap-medium rounded-large px-padding-large py-padding-medium",
        styles.container,
        className,
      )}
    >
      {icon ?? <Icon name={styles.icon} className={styles.iconColor} />}
      <div className="flex min-w-0 flex-1 flex-col gap-gap-xxsmall">
        <p className="text-label-small text-text-strong">{title}</p>
        {description && (
          <p className="text-subtext-medium text-text-secondary">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Button
          variant="assistive"
          size="small"
          onClick={action.onClick}
          className="bg-background-default"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
