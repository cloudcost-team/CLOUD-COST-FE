import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

type AppHeaderProps = {
  logoHref?: string;
  start?: ReactNode;
  end?: ReactNode;
  className?: string;
};

export function AppHeader({
  logoHref = "/",
  start,
  end,
  className,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center gap-gap-medium border-b border-border-default bg-background-default px-margin-screen-wide",
        className,
      )}
    >
      <Link href={logoHref} aria-label="CloudCost 처음 화면으로 이동">
        <Logo />
      </Link>
      {start}
      <div className="ml-auto flex items-center gap-gap-medium">{end}</div>
    </header>
  );
}
