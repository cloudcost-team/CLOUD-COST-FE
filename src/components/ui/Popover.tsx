"use client";

import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { useDismiss, type DismissReason } from "@/hooks/useDismiss";
import { cn } from "@/lib/cn";

export type PopoverTriggerProps = {
  ref: RefObject<HTMLButtonElement | null>;
  onClick: () => void;
  "aria-expanded": boolean;
  "aria-haspopup": "dialog";
  "aria-controls": string;
};

type PopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: (props: PopoverTriggerProps) => ReactNode;
  title: string;
  helper?: string;
  actions?: ReactNode;
  align?: "start" | "end";
  className?: string;
  children: ReactNode;
};

export function Popover({
  open,
  onOpenChange,
  trigger,
  title,
  helper,
  actions,
  align = "start",
  className,
  children,
}: PopoverProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const titleId = useId();

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  useDismiss(rootRef, open, (reason: DismissReason) => {
    onOpenChange(false);
    if (reason === "escape") triggerRef.current?.focus();
  });

  return (
    <div ref={rootRef} className="relative inline-block">
      {trigger({
        ref: triggerRef,
        onClick: () => onOpenChange(!open),
        "aria-expanded": open,
        "aria-haspopup": "dialog",
        "aria-controls": panelId,
      })}
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cn(
            "absolute top-full z-50 mt-2 flex w-90 max-w-[calc(100vw-2rem)] flex-col gap-gap-medium rounded-large border border-border-weak bg-background-floated p-padding-large shadow-default outline-none",
            align === "start" ? "left-0" : "right-0",
            className,
          )}
        >
          <p id={titleId} className="text-label-small text-text-strong">
            {title}
          </p>
          {children}
          {helper && (
            <p className="text-subtext-small text-text-tertiary">{helper}</p>
          )}
          {actions && (
            <div className="flex justify-end gap-gap-small">{actions}</div>
          )}
        </div>
      )}
    </div>
  );
}
