"use client";

import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { useDismiss, type DismissReason } from "@/hooks/useDismiss";
import { getArrowKeyIndex } from "@/lib/arrowKeyIndex";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export type DropdownMenuItem =
  | {
      type?: "item";
      key: string;
      label: string;
      meta?: string;
      badge?: ReactNode;
      selected?: boolean;
      tone?: "default" | "danger";
      disabled?: boolean;
      onSelect: () => void;
    }
  | { type: "separator"; key: string };

export type DropdownMenuTriggerProps = {
  ref: RefObject<HTMLButtonElement | null>;
  onClick: () => void;
  "aria-expanded": boolean;
  "aria-haspopup": "menu";
  "aria-controls": string;
};

type DropdownMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: (props: DropdownMenuTriggerProps) => ReactNode;
  items: DropdownMenuItem[];
  header?: ReactNode;
  "aria-label": string;
  align?: "start" | "end";
  className?: string;
};

const itemSelector =
  '[role="menuitem"]:not(:disabled), [role="menuitemradio"]:not(:disabled)';

export function DropdownMenu({
  open,
  onOpenChange,
  trigger,
  items,
  header,
  "aria-label": ariaLabel,
  align = "start",
  className,
}: DropdownMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const singleSelect = items.some(
    (item) => item.type !== "separator" && item.selected !== undefined,
  );

  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const target =
      menu?.querySelector<HTMLElement>('[aria-checked="true"]') ??
      menu?.querySelector<HTMLElement>(itemSelector);
    target?.focus();
  }, [open]);

  function close(returnFocus: boolean) {
    onOpenChange(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  useDismiss(rootRef, open, (reason: DismissReason) =>
    close(reason === "escape"),
  );

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Tab") {
      close(false);
      return;
    }
    const menuItems = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(itemSelector),
    );
    const currentIndex = menuItems.indexOf(
      document.activeElement as HTMLElement,
    );
    const nextIndex = getArrowKeyIndex(
      event.key,
      Math.max(currentIndex, 0),
      menuItems.length,
    );
    if (nextIndex === null) return;
    event.preventDefault();
    menuItems[nextIndex]?.focus();
  }

  return (
    <div ref={rootRef} className="relative inline-block">
      {trigger({
        ref: triggerRef,
        onClick: () => onOpenChange(!open),
        "aria-expanded": open,
        "aria-haspopup": "menu",
        "aria-controls": menuId,
      })}
      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={ariaLabel}
          onKeyDown={handleKeyDown}
          className={cn(
            "absolute top-full z-50 mt-2 flex flex-col gap-gap-xxsmall rounded-large border border-border-weak bg-background-floated p-padding-xsmall shadow-default",
            align === "start" ? "left-0" : "right-0",
            className,
          )}
        >
          {header && (
            <div className="-mx-padding-xsmall -mt-padding-xsmall mb-gap-xxsmall border-b border-border-weak p-padding-medium">
              {header}
            </div>
          )}
          {items.map((item) => {
            if (item.type === "separator") {
              return (
                <div
                  key={item.key}
                  role="separator"
                  className="h-px bg-border-weak"
                />
              );
            }
            return (
              <button
                key={item.key}
                type="button"
                role={singleSelect ? "menuitemradio" : "menuitem"}
                aria-checked={singleSelect ? Boolean(item.selected) : undefined}
                tabIndex={-1}
                disabled={item.disabled}
                onClick={() => {
                  item.onSelect();
                  close(true);
                }}
                className={cn(
                  "flex w-full min-w-70 cursor-pointer items-center gap-gap-small rounded-medium px-padding-small py-padding-xsmall text-left outline-none disabled:cursor-not-allowed",
                  item.selected
                    ? "bg-fill-brand-weak"
                    : "hover:bg-background-lower focus-visible:bg-background-lower disabled:hover:bg-transparent",
                )}
              >
                <span className="flex min-w-0 flex-1 flex-col gap-gap-xxsmall">
                  <span
                    className={cn(
                      "text-label-xsmall-weak",
                      item.selected
                        ? "text-text-brand"
                        : item.disabled
                          ? "text-text-quaternary"
                          : item.tone === "danger"
                            ? "text-text-danger"
                            : "text-text-strong",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.meta && (
                    <span className="text-subtext-small text-text-tertiary">
                      {item.meta}
                    </span>
                  )}
                </span>
                {(item.badge || item.selected) && (
                  <span className="flex shrink-0 items-center gap-gap-xsmall">
                    {item.badge}
                    {item.selected && (
                      <Icon name="check" className="text-icon-brand" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
