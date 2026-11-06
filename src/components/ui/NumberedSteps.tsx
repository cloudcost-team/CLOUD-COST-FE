import { cn } from "@/lib/cn";

type NumberedStepsProps = {
  steps: string[];
  className?: string;
};

export function NumberedSteps({ steps, className }: NumberedStepsProps) {
  return (
    <ol className={cn("flex flex-col gap-gap-medium", className)}>
      {steps.map((step, index) => (
        <li key={step} className="flex items-start gap-gap-medium">
          <span
            aria-hidden
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fill-brand-weak text-label-xsmall text-text-brand"
          >
            {index + 1}
          </span>
          <span className="min-w-0 flex-1 text-body-xsmall text-text-primary">
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}
