"use client";

import type { ReactNode } from "react";
import { Banner } from "@/components/ui/Banner";
import { LoadingState } from "@/components/ui/LoadingState";
import { useConnectionFlow } from "@/hooks/useConnectionFlow";
import { getCloudFormationStacksUrl, openInNewTab } from "@/lib/awsConsole";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ConnectionFailedStep } from "./ConnectionFailedStep";
import { ConnectionFormStep } from "./ConnectionFormStep";
import { ConnectionProgressCard } from "./ConnectionProgressCard";
import { ConnectionSuccessStep } from "./ConnectionSuccessStep";
import { PageHeader } from "@/components/layout/PageHeader";
import { RoleArnFallbackForm } from "./RoleArnFallbackForm";

function NewConnectionBody() {
  const flow = useConnectionFlow();

  if (!flow.accountId)
    return (
      <ConnectionFormStep
        variant="settings"
        onSubmit={flow.start}
        loading={flow.starting}
        error={flow.startError ?? undefined}
      />
    );

  const { setup, accountQuery, failure } = flow;
  if (!setup) {
    if (accountQuery.isError)
      return (
        <Banner
          title="연결 상태를 불러오지 못했어요"
          description={accountQuery.error.message}
          action={{ label: "다시 시도", onClick: () => accountQuery.refetch() }}
        />
      );
    return <LoadingState title="연결 상태를 확인하고 있어요" />;
  }

  const { account, roleSetup } = setup;
  if (account.status === "ACTIVE")
    return <ConnectionSuccessStep account={account} />;

  const quickCreateUrl = roleSetup.quickCreateUrl;
  const roleArnForm = (flow.roleArnFormOpen || failure) && (
    <RoleArnFallbackForm
      description="자동 연결이 안 될 때, 스택 [출력(Outputs)] 탭의 RoleArn 값을 붙여 넣으면 바로 확인해요."
      loading={flow.registering}
      error={flow.registerError}
      onSubmit={flow.submitRoleArn}
    />
  );

  let status: ReactNode;
  if (failure)
    status = (
      <ConnectionFailedStep
        errorCode={failure.code}
        message={failure.message}
        guide={failure.guide}
        onRecheck={flow.recheck}
        rechecking={flow.registering || accountQuery.isFetching}
        onRestart={flow.cancel}
        restarting={flow.cancelling}
        onOpenConsole={() =>
          openInNewTab(getCloudFormationStacksUrl(account.region))
        }
      />
    );
  else
    status = (
      <ConnectionProgressCard
        stackName={account.stackName}
        isLate={flow.waitPhase !== "normal"}
        canReopenConsole={quickCreateUrl !== null}
        onReopenConsole={() => quickCreateUrl && openInNewTab(quickCreateUrl)}
        onShowRoleArnForm={flow.openRoleArnForm}
      />
    );

  return (
    <div className="flex flex-col gap-spacing-medium">
      {status}
      {!failure && quickCreateUrl === null && (
        <Banner
          tone="warning"
          title="빠른 생성 링크를 만들 수 없어요"
          description={roleSetup.warnings.join(" ")}
        />
      )}
      {roleArnForm}
    </div>
  );
}

export function NewConnectionScreen() {
  return (
    <div className="flex flex-col gap-spacing-medium">
      <Breadcrumb
        items={[
          { label: "설정" },
          { label: "데이터 연결", href: "/settings/connections" },
          { label: "새 연결" },
        ]}
      />
      <PageHeader
        title="새 연결"
        description="다른 AWS 계정이나 리전을 추가로 연결해요."
      />
      <div className="w-full max-w-180">
        <NewConnectionBody />
      </div>
    </div>
  );
}
