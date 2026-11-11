import { cn } from "@/lib/cn";

type LoadingDotsProps = {
  size?: "xlarge" | "large" | "small";
  dotClassName: string;
  className?: string;
};

const sizeClasses = {
  xlarge: { gap: "gap-2.5", first: "size-5", rest: "size-4" },
  large: { gap: "gap-1.5", first: "size-2.5", rest: "size-2" },
  small: { gap: "gap-1", first: "size-2", rest: "size-1.5" },
};

const delays = ["", "[animation-delay:0.2s]", "[animation-delay:0.4s]"];

export function LoadingDots({
  size = "large",
  dotClassName,
  className,
}: LoadingDotsProps) {
  const sizes = sizeClasses[size];
  return (
    <span
      aria-hidden
      className={cn("inline-flex items-center", sizes.gap, className)}
    >
      {delays.map((delay, index) => (
        <span
          key={index}
          className={cn(
            "animate-dot-pulse rounded-full motion-reduce:animate-none",
            index === 0 ? sizes.first : sizes.rest,
            dotClassName,
            delay,
          )}
        />
      ))}
    </span>
  );
}
