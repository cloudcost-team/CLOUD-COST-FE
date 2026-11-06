import Link from "next/link";
import { Fragment } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="현재 위치" className={className}>
      <ol className="flex flex-wrap items-center gap-gap-xxsmall">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && (
                <li aria-hidden className="flex">
                  <Icon
                    name="chevron-right"
                    size={16}
                    className="text-icon-secondary"
                  />
                </li>
              )}
              <li
                aria-current={isLast ? "page" : undefined}
                className={cn(
                  isLast
                    ? "text-label-xsmall text-text-strong"
                    : "text-label-xsmall-weak text-text-tertiary",
                )}
              >
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="rounded-xsmall hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-border-brand"
                  >
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
