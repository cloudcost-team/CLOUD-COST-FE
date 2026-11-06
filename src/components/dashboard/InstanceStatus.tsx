import { cn } from "@/lib/cn";

const stateLabels: Record<string, string> = {
  running: "실행 중",
  stopped: "중지됨",
  stopping: "중지하는 중",
  pending: "시작하는 중",
  terminated: "종료됨",
  "shutting-down": "종료하는 중",
};

type InstanceStatusProps = {
  state: string;
};

export function InstanceStatus({ state }: InstanceStatusProps) {
  const running = state === "running";
  return (
    <span className="inline-flex items-center gap-gap-small">
      <span
        aria-hidden
        className={cn(
          "size-2 shrink-0 rounded-full",
          running ? "bg-fill-mint" : "border border-border-strong",
        )}
      />
      {stateLabels[state] ?? state}
    </span>
  );
}
