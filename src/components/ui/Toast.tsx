"use client";

import Image from "next/image";
import { useEffect } from "react";
import checkCircleFill from "@/assets/toast/check-circle-fill.svg";
import errorCircleFill from "@/assets/toast/error-circle-fill.svg";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

type ToastTone = "success" | "error" | "default";

type ToastAction = {
  label: string;
  onClick: () => void;
};

type ToastProps = {
  open: boolean;
  onClose: () => void;
  text: string;
  tone?: ToastTone;
  action?: ToastAction;
  className?: string;
};

const TOAST_DURATION_MS = 3000;

const toneIcons = {
  success: checkCircleFill,
  error: errorCircleFill,
  default: null,
} as const;

export function Toast({
  open,
  onClose,
  text,
  tone = "default",
  action,
  className,
}: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [open, text, onClose]);

  const icon = toneIcons[tone];

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-spacing-large z-50 flex justify-center px-margin-screen"
    >
      {open && (
        <div
          className={cn(
            "pointer-events-auto flex w-max max-w-full items-center gap-gap-large rounded-xlarge bg-fill-default/70 px-padding-large py-padding-medium shadow-[0_4px_16px_0_rgb(0_0_0/0.08)] backdrop-blur-[10px]",
            className,
          )}
        >
          <div className="flex min-w-0 flex-1 items-start gap-gap-small">
            {icon && (
              <Image
                src={icon}
                alt=""
                width={20}
                height={20}
                className="shrink-0"
              />
            )}
            <p className="line-clamp-2 min-w-0 flex-1 text-label-xsmall text-text-primary">
              {text}
            </p>
          </div>
          {action && (
            <Button
              variant="assistive"
              size="small"
              onClick={action.onClick}
              className="min-w-13 rounded-full px-padding-xsmall text-text-primary"
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
