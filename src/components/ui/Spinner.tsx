import { cn } from "@/lib/cn";

type SpinnerProps = {
  size?: "medium" | "large";
  className?: string;
};

const sizeClasses = {
  medium: "size-6",
  large: "size-10",
};

const radius = 10.8;
const circumference = 2 * Math.PI * radius;

export function Spinner({ size = "medium", className }: SpinnerProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      focusable="false"
      className={cn("shrink-0 animate-spin", sizeClasses[size], className)}
    >
      <circle
        cx="12"
        cy="12"
        r={radius}
        strokeWidth="2.4"
        className="stroke-fill-neutral-weak"
      />
      <circle
        cx="12"
        cy="12"
        r={radius}
        strokeWidth="2.4"
        strokeDasharray={`${circumference / 2} ${circumference}`}
        transform="rotate(-90 12 12)"
        className="stroke-fill-brand"
      />
    </svg>
  );
}
