import { cn } from "@/lib/cn";
import { LoadingDots } from "./LoadingDots";

type LoadingStateProps = {
  title: string;
  className?: string;
};

export function LoadingState({ title, className }: LoadingStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "fixed inset-0 z-40 flex items-center justify-center bg-background-default/70 backdrop-blur-sm",
        className,
      )}
    >
      <LoadingDots size="xlarge" dotClassName="bg-fill-brand" />
      <span className="sr-only">{title}</span>
    </div>
  );
}
