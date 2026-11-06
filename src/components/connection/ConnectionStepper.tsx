import { Fragment } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const STEPS = ["연결 정보", "AWS에서 스택 만들기", "연결 확인"];

type ConnectionStepperProps = {
  currentStep: 1 | 2 | 3 | "done";
  className?: string;
};

export function ConnectionStepper({
  currentStep,
  className,
}: ConnectionStepperProps) {
  const currentIndex = currentStep === "done" ? STEPS.length : currentStep - 1;

  return (
    <ol className={cn("flex flex-wrap items-center gap-gap-medium", className)}>
      {STEPS.map((label, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <Fragment key={label}>
            {index > 0 && (
              <li aria-hidden className="h-px w-8 bg-border-default" />
            )}
            <li
              aria-current={isCurrent ? "step" : undefined}
              className="flex items-center gap-gap-small"
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-label-xsmall",
                  isDone && "bg-fill-brand-weak",
                  isCurrent && "bg-fill-brand text-text-on-fill",
                  !isDone &&
                    !isCurrent &&
                    "bg-fill-neutral-weak text-text-quaternary",
                )}
              >
                {isDone ? (
                  <Icon name="check" size={16} className="text-icon-brand" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  "text-label-xsmall",
                  isDone && "text-text-secondary",
                  isCurrent && "text-text-strong",
                  !isDone && !isCurrent && "text-text-quaternary",
                )}
              >
                {isDone && <span className="sr-only">완료: </span>}
                {label}
              </span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
