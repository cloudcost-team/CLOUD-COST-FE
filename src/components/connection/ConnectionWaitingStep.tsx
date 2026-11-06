import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NumberedSteps } from "@/components/ui/NumberedSteps";
import { TextButton } from "@/components/ui/TextButton";
import { ConnectionStepper } from "./ConnectionStepper";
import { ConnectionWaitingCard } from "./ConnectionWaitingCard";

const CONSOLE_STEPS = [
  "연결할 AWS 계정으로 로그인해요 (이미 로그인했다면 넘어가요)",
  "페이지 맨 아래 「IAM 리소스를 생성할 수 있음을 승인합니다」를 체크해요",
  "[스택 생성]을 눌러요. 나머지 값은 미리 채워져 있어서 바꾸지 않아도 돼요",
];

type ConnectionWaitingStepProps = {
  stackName: string;
  isLate: boolean;
  canReopenConsole: boolean;
  onReopenConsole: () => void;
  onShowRoleArnForm: () => void;
  onCancel: () => void;
  cancelling: boolean;
};

export function ConnectionWaitingStep({
  stackName,
  isLate,
  canReopenConsole,
  onReopenConsole,
  onShowRoleArnForm,
  onCancel,
  cancelling,
}: ConnectionWaitingStepProps) {
  return (
    <div className="flex flex-col gap-spacing-medium">
      <ConnectionStepper currentStep={2} />
      <div className="flex flex-col gap-gap-small">
        <h1 className="text-display-small text-text-strong">
          AWS 콘솔에서 스택을 만들어 주세요
        </h1>
        <p className="text-subtext-large text-text-tertiary">
          {isLate
            ? "2분이 지났는데 아직 신호가 없어요. 아래 내용을 확인해 주세요."
            : "새 탭에서 AWS CloudFormation이 열렸어요. 스택을 만들면 이 화면이 자동으로 다음 단계로 넘어가요."}
        </p>
      </div>
      {!isLate && (
        <Card>
          <h2 className="text-title-xsmall text-text-strong">
            새 탭의 AWS 콘솔에서 이렇게 해 주세요
          </h2>
          <NumberedSteps steps={CONSOLE_STEPS} />
        </Card>
      )}
      <ConnectionWaitingCard
        title={
          isLate
            ? "아직 스택 생성 신호가 오지 않았어요"
            : "스택 생성 신호를 기다리고 있어요"
        }
        stackName={stackName}
      />
      {isLate && (
        <>
          <Banner
            tone="warning"
            title="스택 생성이 실패했을 수 있어요"
            description={`AWS 콘솔 → CloudFormation → 스택 ${stackName} → [이벤트] 탭에서 '상태 사유'를 확인해 주세요. 스택을 아직 만들지 않았다면 새 탭에서 [스택 생성]을 눌러 주세요.`}
          />
          <div className="flex flex-wrap items-center justify-between gap-gap-small">
            <div className="flex flex-wrap gap-gap-small">
              {canReopenConsole && (
                <Button
                  variant="secondary"
                  icon="external-link"
                  onClick={onReopenConsole}
                >
                  AWS 콘솔 다시 열기
                </Button>
              )}
              <Button variant="assistive" onClick={onShowRoleArnForm}>
                Role ARN 직접 입력하기
              </Button>
            </div>
            <TextButton onClick={onCancel} disabled={cancelling}>
              연결 취소
            </TextButton>
          </div>
        </>
      )}
      {!isLate && (
        <div className="flex flex-wrap items-center justify-between gap-gap-small">
          {canReopenConsole ? (
            <div className="flex items-center gap-gap-small">
              <p className="text-subtext-medium text-text-tertiary">
                새 탭이 열리지 않았나요?
              </p>
              <TextButton
                tone="brand"
                icon="external-link"
                onClick={onReopenConsole}
              >
                AWS 콘솔 다시 열기
              </TextButton>
            </div>
          ) : (
            <span />
          )}
          <TextButton onClick={onCancel} disabled={cancelling}>
            연결 취소
          </TextButton>
        </div>
      )}
    </div>
  );
}
