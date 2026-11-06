import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type ConnectionWaitingCardProps = {
  title: string;
  stackName: string;
  className?: string;
};

export function ConnectionWaitingCard({
  title,
  stackName,
  className,
}: ConnectionWaitingCardProps) {
  return (
    <Card role="status" className={cn("flex-row items-center", className)}>
      <span
        aria-hidden
        className="relative flex size-6 shrink-0 items-center justify-center"
      >
        <span className="absolute size-2.5 animate-ping rounded-full bg-fill-brand opacity-60" />
        <span className="relative size-2.5 rounded-full bg-fill-brand" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-gap-xsmall">
        <div className="flex flex-wrap items-center gap-gap-small">
          <p className="text-label-small text-text-strong">{title}</p>
          <Badge>보통 1~2분</Badge>
        </div>
        <p className="text-subtext-medium break-words text-text-tertiary">
          스택 이름 {stackName} · 이 화면을 닫아도 연결은 계속 진행돼요
        </p>
      </div>
    </Card>
  );
}
