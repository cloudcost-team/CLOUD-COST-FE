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
  disabled?: boolean;
  className?: string;
};

export function SelectBox({
  label,
  options,
  value,
  onValueChange,
  disabled,
  className,
}: SelectBoxProps) {
  const triggerId = useId();
  return (
    <div
      className={cn(
        "flex flex-col gap-gap-xxsmall rounded-xxxlarge border-2 border-transparent bg-fill-neutral-weak px-padding-large py-padding-small transition-colors focus-within:border-border-brand focus-within:bg-background-default",
        disabled && "opacity-45",
        className,
      )}
    >
      <label
        htmlFor={triggerId}
        className="pt-1 text-subtext-medium-strong text-text-secondary"
      >
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={triggerId}
          className="h-8 rounded-none border-0 bg-transparent px-0 text-body-medium text-text-strong hover:border-0 focus:border-0 focus:ring-0 [&>svg]:size-5"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
