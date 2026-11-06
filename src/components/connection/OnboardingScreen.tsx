"use client";

import { Banner } from "@/components/ui/Banner";
import { LoadingState } from "@/components/ui/LoadingState";
import { useConnectionFlow } from "@/hooks/useConnectionFlow";
import { getCloudFormationStacksUrl, openInNewTab } from "@/lib/awsConsole";
import { ConnectionFailedStep } from "./ConnectionFailedStep";
import { ConnectionFormStep } from "./ConnectionFormStep";
import { ConnectionSuccessStep } from "./ConnectionSuccessStep";
import { ConnectionWaitingStep } from "./ConnectionWaitingStep";
import { RoleArnFallbackForm } from "./RoleArnFallbackForm";

export function OnboardingScreen() {
  const flow = useConnectionFlow();

  if (!flow.accountId)
    return (
      <ConnectionFormStep
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

  return (
    <div className="flex flex-col gap-spacing-medium">
      {failure ? (
        <ConnectionFailedStep
          errorCode={failure.code}
          message={failure.message}
          guide={failure.guide}
          onRestart={flow.cancel}
          restarting={flow.cancelling}
          onOpenConsole={() =>
            openInNewTab(getCloudFormationStacksUrl(account.region))
          }
        />
      ) : (
        <ConnectionWaitingStep
          stackName={account.stackName}
          isLate={flow.waitPhase !== "normal"}
          canReopenConsole={quickCreateUrl !== null}
          onReopenConsole={() => quickCreateUrl && openInNewTab(quickCreateUrl)}
          onShowRoleArnForm={flow.openRoleArnForm}
          onCancel={flow.cancel}
          cancelling={flow.cancelling}
        />
      )}
      {!failure && quickCreateUrl === null && (
        <Banner
          tone="warning"
          title="빠른 생성 링크를 만들 수 없어요"
          description={roleSetup.warnings.join(" ")}
        />
      )}
      {(flow.roleArnFormOpen || failure) && (
        <RoleArnFallbackForm
          loading={flow.registering}
          error={flow.registerError}
          onSubmit={flow.submitRoleArn}
        />
      )}
    </div>
  );
}
