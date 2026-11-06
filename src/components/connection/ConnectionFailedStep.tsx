"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ErrorReason } from "@/components/ui/ErrorReason";
import { ConnectionStepper } from "./ConnectionStepper";

type ConnectionFailedStepProps = {
  errorCode?: string;
  message: string;
  guide: string;
  onRestart: () => void;
  restarting: boolean;
  onOpenConsole: () => void;
  onRecheck?: () => void;
  rechecking?: boolean;
};

export function ConnectionFailedStep({
  errorCode,
  message,
  guide,
  onRestart,
  restarting,
  onOpenConsole,
  onRecheck,
  rechecking = false,
}: ConnectionFailedStepProps) {
  const router = useRouter();
  const alreadyConnected = errorCode === "ALREADY_CONNECTED";

  return (
    <div className="flex flex-col gap-spacing-medium">
      <ConnectionStepper currentStep={3} />
      <ErrorReason title="연결하지 못했어요" message={message} guide={guide} />
      <div className="flex flex-wrap gap-gap-small">
        {alreadyConnected ? (
          <>
            <Button onClick={() => router.push("/settings/connections")}>
              기존 연결 보기
            </Button>
            <Button
              variant="secondary"
              loading={restarting}
              onClick={onRestart}
            >
              처음부터 다시 연결
            </Button>
          </>
        ) : onRecheck ? (
          <>
            <Button loading={rechecking} onClick={onRecheck}>
              다시 확인
            </Button>
            <Button
              variant="secondary"
              loading={restarting}
              onClick={onRestart}
            >
              처음부터 다시 연결
            </Button>
          </>
        ) : (
          <>
            <Button loading={restarting} onClick={onRestart}>
              처음부터 다시 연결
            </Button>
            <Button
              variant="secondary"
              icon="external-link"
              onClick={onOpenConsole}
            >
              AWS 콘솔 열기
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
