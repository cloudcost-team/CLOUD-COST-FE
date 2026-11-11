import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Panel } from "@/components/ui/Panel";
import { cn } from "@/lib/cn";
import { ConnectionStepper } from "./ConnectionStepper";

type ProgressState = "done" | "active" | "waiting";

const PROGRESS_STEPS: { label: string; state: ProgressState }[] = [
  { label: "연결 정보 저장", state: "done" },
  { label: "스택 생성 신호 기다리는 중", state: "active" },
  { label: "읽기 권한 확인 (AssumeRole)", state: "waiting" },
];

const stateLabels: Record<ProgressState, string> = {
  done: "완료",
  active: "진행 중",
  waiting: "대기",
};

const labelClasses: Record<ProgressState, string> = {
  done: "text-subtext-medium text-text-primary",
  active: "text-subtext-medium-strong text-text-strong",
  waiting: "text-subtext-medium text-text-quaternary",
};

function ProgressMarker({ state }: { state: ProgressState }) {
  if (state === "done")
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-fill-brand">
        <Icon name="check" size={16} className="text-icon-on-fill" />
      </span>
    );
  if (state === "active")
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-fill-brand-weak">
        <span className="size-2.5 animate-signal-pulse rounded-full bg-fill-brand motion-reduce:animate-none" />
      </span>
    );
  return (
    <span className="block size-6 rounded-full border-2 border-border-default bg-background-default" />
  );
}

function ProgressTimeline() {
  return (
    <ol className="flex flex-col">
      {PROGRESS_STEPS.map((step, index) => {
        const isLast = index === PROGRESS_STEPS.length - 1;
        return (
          <li
            key={step.label}
            className={cn(
              "relative flex gap-gap-medium",
              !isLast && "pb-gap-xlarge",
            )}
          >
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-7 bottom-1 left-3 w-0.5 -translate-x-1/2 rounded-full",
                  step.state === "done" ? "bg-fill-brand" : "bg-border-default",
                )}
              />
            )}
            <span aria-hidden className="flex shrink-0">
              <ProgressMarker state={step.state} />
            </span>
            <span className={cn("pt-0.5", labelClasses[step.state])}>
              <span className="sr-only">{stateLabels[step.state]}: </span>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

type ConnectionProgressCardProps = {
  stackName: string;
  isLate: boolean;
  canReopenConsole: boolean;
  onReopenConsole: () => void;
  onShowRoleArnForm: () => void;
};

export function ConnectionProgressCard({
  stackName,
  isLate,
  canReopenConsole,
  onReopenConsole,
  onShowRoleArnForm,
}: ConnectionProgressCardProps) {
  return (
    <Card className="gap-spacing-medium">
      <ConnectionStepper currentStep={2} />
      <div role="status" className="flex flex-col gap-gap-xsmall">
        <p className="text-title-small text-text-strong">
          AWS에서 스택을 만들고 있어요
        </p>
        <p className="text-subtext-medium text-text-tertiary">
          보통 1~2분 걸려요. 이 화면을 닫아도 연결은 계속 진행돼요.
        </p>
      </div>
      <ProgressTimeline />
      {isLate && (
        <Panel className="flex flex-col gap-gap-small">
          <div className="flex flex-wrap items-center gap-gap-small">
            <Badge tone="warning">2분 경과</Badge>
            <p className="text-label-xsmall text-text-strong">
              아직 연결 신호가 오지 않았어요
            </p>
          </div>
          <p className="text-subtext-medium break-words text-text-tertiary">
            AWS CloudFormation 콘솔에서 스택 {stackName}의 [이벤트] 탭을 확인해
            주세요. 스택 생성이 실패했다면 이유가 거기에 나와요.
          </p>
        </Panel>
      )}
      <div className="flex flex-wrap gap-gap-small">
        {canReopenConsole && (
          <Button
            variant="secondary"
            size="medium"
            icon="external-link"
            onClick={onReopenConsole}
          >
            AWS 콘솔 다시 열기
          </Button>
        )}
        <Button variant="assistive" size="medium" onClick={onShowRoleArnForm}>
          Role ARN 직접 입력하기
        </Button>
      </div>
    </Card>
  );
}
