import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Panel } from "@/components/ui/Panel";
import { Spinner } from "@/components/ui/Spinner";
import { ConnectionStepper } from "./ConnectionStepper";

const PROGRESS_STEPS: { label: string; badge: string; tone: BadgeTone }[] = [
  { label: "연결 정보 저장", badge: "완료", tone: "success" },
  { label: "스택 생성 신호 기다리는 중", badge: "진행 중", tone: "brand" },
  { label: "읽기 권한 확인 (AssumeRole)", badge: "대기", tone: "neutral" },
];

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
      <div role="status" className="flex items-center gap-gap-large">
        <Spinner size="large" />
        <div className="flex min-w-0 flex-col gap-gap-xsmall">
          <p className="text-title-small text-text-strong">
            AWS에서 스택을 만들고 있어요
          </p>
          <p className="text-subtext-medium text-text-tertiary">
            보통 1~2분 걸려요. 이 화면을 닫아도 연결은 계속 진행돼요.
          </p>
        </div>
      </div>
      <Panel as="ol" variant="outline" className="flex flex-col gap-gap-medium">
        {PROGRESS_STEPS.map((step) => (
          <li key={step.label} className="flex items-center gap-gap-medium">
            <Badge tone={step.tone}>{step.badge}</Badge>
            <span
              className={
                step.tone === "brand"
                  ? "text-subtext-medium-strong text-text-strong"
                  : step.tone === "neutral"
                    ? "text-subtext-medium text-text-quaternary"
                    : "text-subtext-medium text-text-primary"
              }
            >
              {step.label}
            </span>
          </li>
        ))}
      </Panel>
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
