"use client";

import {
  useEffect,
  useEffectEvent,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { IconButton } from "@/components/ui/IconButton";
import { useModalDialog } from "@/hooks/useModalDialog";
import { cn } from "@/lib/cn";
import { AppHeader } from "./AppHeader";

type AppShellProps = {
  logoHref?: string;
  headerStart?: ReactNode;
  headerEnd?: ReactNode;
  sidebar?: ReactNode;
  menuFooter?: ReactNode;
  mainClassName?: string;
  children: ReactNode;
};

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
};

function MobileMenu({ open, onClose, footer, children }: MobileMenuProps) {
  const dialogProps = useModalDialog(open, onClose);
  const closeMenu = useEffectEvent(onClose);

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 48rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) closeMenu();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [open]);

  function closeOnAction(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a, button")) onClose();
  }

  return (
    <dialog
      {...dialogProps}
      aria-label="메뉴"
      className={cn(
        "fixed inset-y-0 right-auto left-0 m-0 h-full max-h-none w-60 max-w-[calc(100%-48px)] border-none bg-background-default p-0 text-text-primary shadow-strong backdrop:bg-background-dim md:hidden",
        "transition-transform duration-300 ease-out starting:open:-translate-x-full motion-reduce:transition-none",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 shrink-0 items-center justify-end border-b border-border-default px-padding-small">
          <IconButton
            icon="close"
            size="medium"
            aria-label="메뉴 닫기"
            onClick={onClose}
          />
        </div>
        <div
          className="flex min-h-0 flex-1 flex-col overflow-y-auto"
          onClick={closeOnAction}
        >
          <div className="flex flex-1">{open && children}</div>
          {footer && (
            <div className="flex flex-col gap-gap-small border-t border-border-default p-padding-medium">
              {footer}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}

export function AppShell({
  logoHref,
  headerStart,
  headerEnd,
  sidebar,
  menuFooter,
  mainClassName,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null);
  const menuOpen = menuOpenedAt === pathname;

  return (
    <div className="flex min-h-screen flex-col bg-background-lower">
      <AppHeader
        logoHref={logoHref}
        menu={
          sidebar && (
            <IconButton
              icon="menu"
              size="medium"
              aria-label="메뉴 열기"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpenedAt(pathname)}
              className="md:hidden"
            />
          )
        }
        start={headerStart}
        end={headerEnd}
      />
      <div className="flex flex-1">
        {sidebar && <div className="hidden md:flex">{sidebar}</div>}
        <main className={cn("w-full min-w-0 flex-1", mainClassName)}>
          {children}
        </main>
      </div>
      {sidebar && (
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpenedAt(null)}
          footer={menuFooter}
        >
          {sidebar}
        </MobileMenu>
      )}
    </div>
  );
}
