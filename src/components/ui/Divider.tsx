import { cn } from "@/lib/cn";

type DividerProps = {
  label?: string;
  className?: string;
};

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return (
      <div
        role="separator"
        className={cn("h-px w-full bg-border-default", className)}
      />
    );
  }

  return (
    <div
      role="separator"
      aria-label={label}
      className={cn("flex w-full items-center gap-gap-medium", className)}
    >
      <span className="h-px min-w-0 flex-1 bg-border-default" />
      <span
        aria-hidden
        className="shrink-0 text-subtext-medium text-text-tertiary"
      >
        {label}
      </span>
      <span className="h-px min-w-0 flex-1 bg-border-default" />
    </div>
  );
}
