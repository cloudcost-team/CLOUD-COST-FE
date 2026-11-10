"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";

export type SelectBoxOption = {
  value: string;
  label: string;
};

type SelectBoxProps = {
  label: string;
  options: SelectBoxOption[];
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function SelectBox({
  label,
  options,
  value,
  onValueChange,
  required,
  disabled,
  className,
}: SelectBoxProps) {
  const triggerId = useId();
  return (
    <div
      className={cn(
        "flex flex-col gap-gap-xxsmall rounded-xxxlarge border-2 border-transparent bg-fill-neutral-weak px-padding-large py-padding-medium transition-colors focus-within:border-border-brand focus-within:bg-background-default",
        disabled && "opacity-45",
        className,
      )}
    >
      <div className="flex items-start gap-gap-xxsmall pt-1 text-subtext-medium-strong">
        <label htmlFor={triggerId} className="text-text-secondary">
          {label}
        </label>
        {required && (
          <span aria-hidden className="text-text-danger">
            *
          </span>
        )}
      </div>
      <Select
        value={value}
        onValueChange={onValueChange}
        required={required}
        disabled={disabled}
      >
        <SelectTrigger
          id={triggerId}
          aria-required={required || undefined}
          className="h-8 rounded-none border-0 bg-transparent px-0 text-body-medium text-text-strong hover:border-0 focus:border-0 focus:ring-0 [&>svg]:size-5"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-80 rounded-xlarge p-1.5">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="h-12 rounded-large pl-10 text-body-medium"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
