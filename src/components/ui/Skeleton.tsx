import { cn } from "@/lib/cn";

export type SkeletonShape = "text" | "title" | "block" | "circle";

type SkeletonProps = {
  shape?: SkeletonShape;
  className?: string;
};

const shapeClasses: Record<SkeletonShape, string> = {
  text: "h-3.5 w-50 rounded-xsmall",
  title: "h-6 w-35 rounded-small",
  block: "h-30 w-80 rounded-large",
  circle: "size-10 rounded-full",
};

export function Skeleton({ shape = "text", className }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "block shrink-0 animate-pulse bg-fill-neutral-weak motion-reduce:animate-none",
        shapeClasses[shape],
        className,
      )}
    />
  );
}
