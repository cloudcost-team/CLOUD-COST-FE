import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import type { IconName } from "./iconPaths";
import { LoadingDots } from "./LoadingDots";

export type FieldHelpTextTone = "default" | "error" | "success" | "loading";

type FieldHelpTextProps = {
  tone?: FieldHelpTextTone;
  showIcon?: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
};

const toneClasses: Record<
  FieldHelpTextTone,
  { icon: IconName | null; iconColor: string; text: string }
> = {
  default: {
    icon: "info",
    iconColor: "text-icon-tertiary",
    text: "text-text-tertiary",
  },
  error: {
    icon: "alert-circle",
    iconColor: "text-icon-danger",
    text: "text-text-danger",
  },
  success: {
    icon: "check-circle",
    iconColor: "text-icon-success",
    text: "text-text-success",
  },
  loading: {
    icon: null,
    iconColor: "",
    text: "text-text-tertiary",
  },
};

export function FieldHelpText({
  tone = "default",
  showIcon = true,
  id,
  className,
  children,
}: FieldHelpTextProps) {
  const styles = toneClasses[tone];
  return (
    <p
      id={id}
      className={cn(
        "flex items-center gap-gap-xsmall pl-padding-large text-subtext-small",
        styles.text,
        className,
      )}
    >
      {showIcon &&
        (styles.icon ? (
          <Icon name={styles.icon} size={16} className={styles.iconColor} />
        ) : (
          <LoadingDots size="small" dotClassName="bg-fill-brand" />
        ))}
      <span className="min-w-0">{children}</span>
    </p>
  );
}
