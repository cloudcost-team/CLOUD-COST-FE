import { cn } from "@/lib/cn";

export type ProgressBarTone = "brand" | "warning" | "danger";

type ProgressBarProps = {
  value: number;
  max?: number;
  tone?: ProgressBarTone;
  "aria-label": string;
  className?: string;
};

const toneClasses: Record<ProgressBarTone, string> = {
  brand:
    "[&::-webkit-progress-value]:bg-fill-brand [&::-moz-progress-bar]:bg-fill-brand",
  warning:
    "[&::-webkit-progress-value]:bg-fill-warning [&::-moz-progress-bar]:bg-fill-warning",
  danger:
    "[&::-webkit-progress-value]:bg-fill-danger [&::-moz-progress-bar]:bg-fill-danger",
};

export function ProgressBar({
  value,
  max = 100,
  tone = "brand",
  "aria-label": ariaLabel,
  className,
}: ProgressBarProps) {
  return (
    <progress
      value={Math.min(value, max)}
      max={max}
      aria-label={ariaLabel}
      className={cn(
        "h-2 w-full appearance-none overflow-hidden rounded-full bg-fill-neutral-weak",
        "[&::-webkit-progress-bar]:bg-fill-neutral-weak [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:rounded-full",
        toneClasses[tone],
        className,
      )}
    />
  );
}
