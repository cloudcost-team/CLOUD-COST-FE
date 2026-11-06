import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type InfoGridItem = {
  label: string;
  value: ReactNode;
};

type InfoGridProps = {
  items: InfoGridItem[];
  className?: string;
};

export function InfoGrid({ items, className }: InfoGridProps) {
  return (
    <dl className={cn("flex flex-col gap-gap-medium", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-gap-large">
          <dt className="w-30 shrink-0 text-subtext-medium text-text-tertiary">
            {item.label}
          </dt>
          <dd className="min-w-0 flex-1 text-subtext-large break-words text-text-strong">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
