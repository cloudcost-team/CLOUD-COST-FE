"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { Modal } from "./Modal";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description?: string;
  kind?: "confirm" | "alert";
  tone?: "neutral" | "danger";
  direction?: "horizontal" | "vertical";
  confirmLabel?: string;
  cancelLabel?: string;
  confirmLoading?: boolean;
};

type DialogTextButtonProps = {
  onClick: () => void;
  className?: string;
  autoFocus?: boolean;
  loading?: boolean;
  children: ReactNode;
};

function DialogTextButton({
  onClick,
  className,
  autoFocus,
  loading = false,
  children,
}: DialogTextButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-busy={loading || undefined}
      data-autofocus={autoFocus || undefined}
      className={cn(
        "h-10 cursor-pointer rounded-xsmall px-padding-xxsmall text-label-small disabled:cursor-not-allowed disabled:opacity-45",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  kind = "confirm",
  tone = "neutral",
  direction = "horizontal",
  confirmLabel,
  cancelLabel = "아니오",
  confirmLoading = false,
}: ConfirmDialogProps) {
  const handleConfirm = onConfirm ?? onClose;
  const confirmVariant = tone === "danger" ? "danger" : "primary";

  if (kind === "alert") {
    return (
      <Modal
        open={open}
        onClose={onClose}
        title={title}
        description={description}
        footer={
          <div className="flex justify-end pt-padding-small pr-padding-xlarge pb-padding-large pl-padding-medium">
            <DialogTextButton
              onClick={handleConfirm}
              autoFocus
              loading={confirmLoading}
              className={
                tone === "danger" ? "text-text-danger" : "text-text-brand"
              }
            >
              {confirmLabel ?? "확인"}
            </DialogTextButton>
          </div>
        }
      />
    );
  }

  const confirmButton = (
    <Button
      variant={confirmVariant}
      loading={confirmLoading}
      onClick={handleConfirm}
      className={cn(
        "rounded-full",
        direction === "horizontal" ? "flex-1" : "w-full",
      )}
    >
      {confirmLabel ?? "예"}
    </Button>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        direction === "horizontal" ? (
          <div className="flex gap-gap-small px-padding-medium pt-padding-xlarge pb-padding-medium">
            <Button
              variant="assistive"
              onClick={onClose}
              data-autofocus
              className="flex-1 rounded-full"
            >
              {cancelLabel}
            </Button>
            {confirmButton}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-gap-xsmall px-padding-medium pt-padding-xlarge pb-padding-small">
            {confirmButton}
            <DialogTextButton
              onClick={onClose}
              autoFocus
              className="text-text-secondary"
            >
              {cancelLabel}
            </DialogTextButton>
          </div>
        )
      }
    />
  );
}
