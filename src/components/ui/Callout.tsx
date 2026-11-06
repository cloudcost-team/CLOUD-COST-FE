import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type CalloutProps = {
  className?: string;
  children: ReactNode;
};

export function Callout({ className, children }: CalloutProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-gap-small rounded-medium bg-fill-neutral-weak px-padding-medium py-padding-small",
        className,
      )}
    >
      <Icon name="info" className="text-icon-primary" />
      <p className="min-w-0 flex-1 text-subtext-medium text-text-primary">
        {children}
      </p>
    </div>
  );
}
