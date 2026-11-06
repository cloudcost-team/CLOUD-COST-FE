import { cn } from "@/lib/cn";
import { Button } from "./Button";

type ErrorReasonProps = {
  title?: string;
  message: string;
  guide?: string;
  action?: { label: string; onClick: () => void; loading?: boolean };
  className?: string;
};

export function ErrorReason({
  title = "오류 원인",
  message,
  guide,
  action,
  className,
}: ErrorReasonProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-gap-small rounded-large bg-fill-danger-weak p-padding-large",
        className,
      )}
    >
      <p className="text-label-xsmall text-text-danger">{title}</p>
      <p className="text-subtext-large break-words text-text-strong">
        {message}
      </p>
      {guide && (
        <p className="text-subtext-medium text-text-secondary">{guide}</p>
      )}
      {action && (
        <Button
          variant="assistive"
          size="small"
          loading={action.loading}
          onClick={action.onClick}
          className="bg-background-default"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
