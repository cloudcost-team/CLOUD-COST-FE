"use client";

import { useRouter } from "next/navigation";
import type { AwsAccount } from "@/api/awsAccounts";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { InfoGrid } from "@/components/ui/InfoGrid";
import { ConnectionStepper } from "./ConnectionStepper";

type ConnectionSuccessStepProps = {
  account: AwsAccount;
  variant?: "onboarding" | "settings";
};

export function ConnectionSuccessStep({
  account,
  variant = "onboarding",
}: ConnectionSuccessStepProps) {
  const router = useRouter();
  const details = (
    <InfoGrid
      items={[
        { label: "연결 이름", value: account.alias ?? "이름 없는 연결" },
        { label: "AWS 계정 ID", value: account.awsAccountId },
        { label: "리전", value: account.regionLabel },
        {
          label: "권한",
          value: "EC2·볼륨·스냅샷·고정 IP·로드밸런서 조회 (모두 읽기 전용)",
        },
      ]}
    />
  );
  const footer = (
    <>
      <Callout>
        처음 연결이라 최근 90일 사용 기록을 가져와요. 대시보드가 처음 뜰 때 조금
        걸릴 수 있어요.
      </Callout>
      <Button onClick={() => router.push("/dashboard")}>대시보드로 가기</Button>
    </>
  );

  if (variant === "settings")
    return (
      <Card className="gap-spacing-medium">
        <ConnectionStepper currentStep="done" />
        <div className="flex flex-col gap-gap-xsmall">
          <p className="text-title-small text-text-strong">
            AWS 계정을 연결했어요
          </p>
          <p className="text-subtext-medium text-text-tertiary">
            이제 대시보드에서 EC2 사용 시간과 비용을 볼 수 있어요.
          </p>
        </div>
        {details}
        {footer}
      </Card>
    );

  return (
    <div className="flex flex-col gap-spacing-medium">
      <ConnectionStepper currentStep="done" />
      <div className="flex flex-col gap-gap-small">
        <div className="flex items-center gap-gap-medium">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fill-brand">
            <Icon name="check" className="text-icon-on-fill" />
          </span>
          <h1 className="text-display-small text-text-strong">
            AWS 계정을 연결했어요
          </h1>
        </div>
        <p className="text-subtext-large text-text-tertiary">
          이제 대시보드에서 EC2 사용 시간과 비용을 볼 수 있어요.
        </p>
      </div>
      <Card>{details}</Card>
      {footer}
    </div>
  );
}
