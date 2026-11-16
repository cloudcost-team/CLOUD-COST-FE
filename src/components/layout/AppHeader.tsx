import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

type AppHeaderProps = {
  logoHref?: string;
  menu?: ReactNode;
  start?: ReactNode;
  end?: ReactNode;
  className?: string;
};

export function AppHeader({
  logoHref = "/",
  menu,
  start,
  end,
  className,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center gap-gap-small border-b border-border-default bg-background-default px-margin-screen-compact md:gap-gap-medium md:px-margin-screen-wide",
        className,
      )}
    >
      {menu}
      <Link
        href={logoHref}
        aria-label="CloudCost 처음 화면으로 이동"
        className="shrink-0"
      >
        <Logo brandIcon="face" compact />
      </Link>
      {start}
      <div className="ml-auto flex min-w-0 items-center gap-gap-small md:gap-gap-medium">
        {end}
      </div>
    </header>
  );
}
