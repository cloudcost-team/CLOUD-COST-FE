import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { ButtonLink } from "./ButtonLink";
import { Icon } from "./Icon";
import type { IconName } from "./iconPaths";

type EmptyStateVariant = "plain" | "card" | "subtle";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: IconName;
  action?: { label: string } & ({ onClick: () => void } | { href: string });
  variant?: EmptyStateVariant;
  className?: string;
};

const variantClasses: Record<EmptyStateVariant, string> = {
  plain: "",
  card: "rounded-xlarge border border-border-default bg-background-floated",
  subtle: "rounded-xlarge bg-background-lower",
};

export function EmptyState({
  title,
  description,
  icon = "file-text",
  action,
  variant = "plain",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-gap-medium px-spacing-medium py-spacing-large text-center",
        variantClasses[variant],
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
      {action &&
        ("href" in action ? (
          <ButtonLink variant="assistive" size="medium" href={action.href}>
            {action.label}
          </ButtonLink>
        ) : (
          <Button variant="assistive" size="medium" onClick={action.onClick}>
            {action.label}
          </Button>
        ))}
    </div>
  );
}
