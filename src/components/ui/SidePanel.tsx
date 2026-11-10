"use client";

import { useId, type ReactNode } from "react";
import { useModalDialog } from "@/hooks/useModalDialog";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";

type SidePanelProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  badge?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function SidePanel({
  open,
  onClose,
  title,
  badge,
  footer,
  className,
  children,
}: SidePanelProps) {
  const dialogProps = useModalDialog(open, onClose);
  const titleId = useId();

  return (
    <dialog
      {...dialogProps}
      aria-labelledby={titleId}
      className={cn(
        "fixed inset-y-0 right-0 left-auto m-0 h-full max-h-none w-120 max-w-full border-none bg-background-floated p-0 text-text-primary shadow-strong backdrop:bg-background-dim",
        "translate-x-full transition-[translate,display,overlay] transition-discrete duration-300 ease-out open:translate-x-0 starting:open:translate-x-full",
        "backdrop:opacity-0 backdrop:transition-[opacity,display,overlay] backdrop:transition-discrete backdrop:duration-300 open:backdrop:opacity-100 starting:open:backdrop:opacity-0",
        "motion-reduce:transition-none motion-reduce:backdrop:transition-none",
        className,
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center gap-gap-small border-b border-border-weak px-padding-xlarge py-padding-large">
          <h2 id={titleId} className="text-title-small text-text-strong">
            {title}
          </h2>
          {badge}
          <IconButton
            icon="close"
            size="medium"
            aria-label="닫기"
            onClick={onClose}
            className="ml-auto"
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-gap-large overflow-y-auto p-padding-xlarge">
          {children}
        </div>
        {footer && (
          <div className="flex shrink-0 gap-gap-small border-t border-border-weak px-padding-xlarge py-padding-large">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
}
