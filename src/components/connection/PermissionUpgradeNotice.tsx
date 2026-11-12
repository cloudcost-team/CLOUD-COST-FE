"use client";

import { useState } from "react";
import type { PermissionUpgrade, ResourceScan } from "@/api/waste";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { TextButton } from "@/components/ui/TextButton";
import { trackEvent } from "@/lib/analytics";

type PermissionUpgradeNoticeProps = {
  scan: ResourceScan;
  upgrade: PermissionUpgrade | null;
};

function TemplateUrlField({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-gap-xsmall">
      <p className="text-subtext-small text-text-tertiary">템플릿 주소</p>
      <div className="flex items-center gap-gap-medium rounded-medium bg-background-lower px-padding-medium py-padding-small">
        <code className="min-w-0 flex-1 truncate text-subtext-medium text-text-primary">
          {url}
        </code>
        <TextButton
          tone="brand"
          icon={copied ? "check" : undefined}
          onClick={copy}
        >
          {copied ? "완료" : "복사"}
        </TextButton>
      </div>
    </div>
  );
}

function UpgradeSteps({ upgrade }: { upgrade: PermissionUpgrade }) {
  return (
    <div className="flex flex-col gap-gap-medium rounded-large bg-background-default p-padding-large">
      <ol className="flex flex-col gap-gap-small text-subtext-medium text-text-secondary">
        {upgrade.steps.map((step, index) => (
          <li key={step} className="flex gap-gap-small">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-warning-weak text-subtext-small text-text-warning">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      {upgrade.templateUrl && <TemplateUrlField url={upgrade.templateUrl} />}
      {upgrade.method === "MANUAL_ROLE" && upgrade.permissionPolicy && (
        <pre className="overflow-x-auto rounded-medium bg-background-lower p-padding-medium text-subtext-small text-text-secondary">
          {JSON.stringify(upgrade.permissionPolicy, null, 2)}
        </pre>
      )}
    </div>
  );
}

export function PermissionUpgradeNotice({
  scan,
  upgrade,
}: PermissionUpgradeNoticeProps) {
  const [stepsOpen, setStepsOpen] = useState(false);
  const hasSteps = Boolean(upgrade && upgrade.steps.length > 0);

  return (
    <section className="flex gap-gap-medium rounded-xlarge border border-border-default bg-fill-warning-weak p-padding-large">
      <Icon
        name="alert-triangle"
        className="mt-0.5 shrink-0 text-icon-warning"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-gap-medium">
        <div className="flex flex-col gap-gap-xxsmall">
          <h2 className="text-label-small text-text-strong">
            권한 업데이트가 필요해요
          </h2>
          <p className="text-subtext-medium text-text-secondary">
            {scan.message ??
              "이전 템플릿으로 연결해서 볼륨·고정 IP·스냅샷·로드밸런서와 다른 리전 서버를 확인할 수 없어요."}
          </p>
          <p className="text-subtext-small text-text-tertiary">
            추가되는 권한도 모두 읽기 전용이에요.
          </p>
        </div>
        {upgrade && (
          <div className="flex flex-wrap items-center gap-gap-large">
            <ButtonLink
              href={upgrade.consoleUrl}
              external
              size="small"
              icon="external-link"
              onClick={() =>
                trackEvent("permission_upgrade_click", {
                  method: upgrade.method,
                })
              }
            >
              {upgrade.method === "STACK"
                ? "AWS 콘솔에서 스택 업데이트"
                : "AWS 콘솔에서 IAM Role 열기"}
            </ButtonLink>
            {hasSteps && (
              <TextButton
                tone="brand"
                icon={stepsOpen ? "chevron-up" : "chevron-down"}
                aria-expanded={stepsOpen}
                onClick={() => setStepsOpen((open) => !open)}
              >
                {stepsOpen ? "업데이트 방법 접기" : "업데이트 방법 보기"}
              </TextButton>
            )}
          </div>
        )}
        {stepsOpen && upgrade && <UpgradeSteps upgrade={upgrade} />}
      </div>
    </section>
  );
}
