"use client";

import { useId, type ReactNode } from "react";
import { useModalDialog } from "@/hooks/useModalDialog";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  className,
  children,
}: ModalProps) {
  const dialogProps = useModalDialog(open, onClose);
  const titleId = useId();
  const descriptionId = useId();

  return (
    <dialog
      {...dialogProps}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "m-auto w-90 max-w-[calc(100%-32px)] overflow-hidden rounded-xxxlarge border-none bg-background-floated p-0 text-text-primary shadow-strong backdrop:bg-background-dim",
        className,
      )}
    >
      <div className="flex flex-col">
        <div className="flex flex-col gap-gap-small px-padding-xlarge pt-padding-xlarge pb-padding-xsmall">
          <h2 id={titleId} className="text-title-small text-text-strong">
            {title}
          </h2>
          {description && (
            <p
              id={descriptionId}
              className="text-body-medium text-text-secondary"
            >
              {description}
            </p>
          )}
        </div>
        {children}
        {footer}
      </div>
    </dialog>
  );
}
