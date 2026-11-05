"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { FieldHelpText } from "./FieldHelpText";
import { Icon } from "./Icon";

type InputProps = Omit<ComponentProps<"input">, "prefix" | "size"> & {
  label: string;
  helperText?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  showCounter?: boolean;
  onClear?: () => void;
};

export function Input({
  label,
  helperText,
  error,
  prefix,
  suffix,
  showCounter = false,
  onClear,
  id,
  required,
  disabled,
  maxLength,
  value,
  className,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helpId = `${inputId}-help`;
  const hasError = Boolean(error);
  const helpMessage = error ?? helperText;
  const length = String(value ?? "").length;
  const counterVisible = showCounter && maxLength !== undefined;
  const hasHelpRow = Boolean(helpMessage) || counterVisible;

  return (
    <div
      className={cn(
        "flex flex-col gap-gap-small",
        disabled && "opacity-45",
        className,
      )}
    >
      <div
        className={cn(
          "group flex flex-col gap-gap-xxsmall rounded-xxxlarge border-2 px-padding-large py-padding-small transition-colors",
          hasError
            ? "border-border-danger bg-fill-danger-weak"
            : "border-transparent bg-fill-neutral-weak focus-within:border-border-brand focus-within:bg-background-default",
        )}
      >
        <label
          htmlFor={inputId}
          className={cn(
            "flex items-start gap-gap-xxsmall pt-1 text-subtext-medium-strong",
            hasError ? "text-text-danger" : "text-text-secondary",
          )}
        >
          {label}
          {required && (
            <span aria-hidden className="size-1 rounded-full bg-fill-danger" />
          )}
        </label>
        <div className="flex h-8 items-center gap-gap-xsmall">
          {prefix && (
            <span className="shrink-0 text-label-small text-text-strong">
              {prefix}
            </span>
          )}
          <input
            id={inputId}
            value={value}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            aria-invalid={hasError || undefined}
            aria-describedby={helpMessage ? helpId : undefined}
            className="min-w-0 flex-1 bg-transparent text-body-medium text-text-strong caret-fill-brand outline-none placeholder:text-text-quaternary disabled:cursor-not-allowed"
            {...rest}
          />
          {onClear && length > 0 && !disabled && (
            <button
              type="button"
              aria-label="입력값 지우기"
              onClick={onClear}
              className="hidden size-[18px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-fill-neutral-medium text-icon-on-fill group-focus-within:flex"
            >
              <Icon name="close" className="size-3" />
            </button>
          )}
          {suffix && (
            <span className="shrink-0 text-label-small text-text-strong">
              {suffix}
            </span>
          )}
        </div>
      </div>
      {hasHelpRow && (
        <div className="flex items-center">
          <div className="min-w-0 flex-1">
            {helpMessage && (
              <FieldHelpText id={helpId} tone={hasError ? "error" : "default"}>
                {helpMessage}
              </FieldHelpText>
            )}
          </div>
          {counterVisible && (
            <span
              className={cn(
                "shrink-0 pr-padding-medium pl-2 text-subtext-small",
                hasError || length > maxLength
                  ? "text-text-danger"
                  : "text-text-tertiary",
              )}
            >
              {length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
