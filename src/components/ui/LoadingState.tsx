import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

type LoadingStateProps = {
  title: string;
  description?: string;
  className?: string;
};

export function LoadingState({
  title,
  description,
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center gap-gap-medium px-spacing-medium py-spacing-large text-center",
        className,
      )}
    >
      <Spinner size="large" />
      <div className="flex flex-col items-center gap-gap-xsmall">
        <p className="text-title-xsmall text-text-strong">{title}</p>
        {description && (
          <p className="text-body-xsmall text-text-tertiary">{description}</p>
        )}
      </div>
    </div>
  );
}
