"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AwsAccount } from "@/api/awsAccounts";
import { ApiError } from "@/api/client";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorReason } from "@/components/ui/ErrorReason";
import { InfoGrid } from "@/components/ui/InfoGrid";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  useAwsAccount,
  useRegisterAwsAccountRole,
} from "@/hooks/useAwsAccounts";
import { cn } from "@/lib/cn";
import { useResourceWaste } from "@/hooks/useWaste";
import { formatKstDateTime } from "@/lib/kstDate";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ConnectionDangerZone } from "./ConnectionDangerZone";
import { getConnectionStatusLabel } from "./ConnectionStatusBadge";
import { PermissionUpgradeNotice } from "./PermissionUpgradeNotice";
import { PageHeader } from "@/components/layout/PageHeader";
import { RenameConnectionModal } from "./RenameConnectionModal";
import { SyncJobTable } from "./SyncJobTable";

function ConnectionStatusNotice({ account }: { account: AwsAccount }) {
  const registerRole = useRegisterAwsAccountRole();
  const { lastError, roleArn } = account;

  if (lastError) {
    const canRecheck = account.status === "ERROR" && roleArn !== null;
    return (
      <ErrorReason
        message={lastError.message}
        guide={
          account.status === "ERROR"
            ? "전에 저장된 데이터는 계속 볼 수 있어요. 1시간마다 자동으로 다시 확인하고, 성공하면 정상으로 돌아와요."
            : "일시적인 오류라 연결은 그대로 유지돼요. 다음 수집 때 다시 시도해요."
        }
        action={
          canRecheck
            ? {
                label: "지금 다시 확인",
                loading: registerRole.isPending,
                onClick: () =>
                  registerRole.mutate({
                    accountId: account.accountId,
                    roleArn,
                  }),
              }
            : undefined
        }
      />
    );
  }
  if (account.status === "PENDING")
    return (
      <Banner
        tone="info"
        title="연결 대기 중이에요"
        description={`AWS에서 스택 ${account.stackName}이 만들어지기를 기다리고 있어요.`}
      />
    );
  return null;
}

function PermissionScanNotice({ account }: { account: AwsAccount }) {
  const { data } = useResourceWaste(
    account.accountId,
    account.status === "ACTIVE",
  );
  if (data?.resources.scan.status !== "PERMISSION_UPGRADE_REQUIRED")
    return null;
  return (
    <PermissionUpgradeNotice
      scan={data.resources.scan}
      upgrade={data.resources.upgrade}
    />
  );
}

function ConnectionDetail({ account }: { account: AwsAccount }) {
  const [renameOpen, setRenameOpen] = useState(false);
  const displayName = account.alias ?? "이름 없는 연결";
  const dimmed = account.status === "DISCONNECTED" && "opacity-40";

  return (
    <>
      <Breadcrumb
        items={[
          { label: "설정" },
          { label: "데이터 연결", href: "/settings/connections" },
          { label: displayName },
        ]}
      />
      <PageHeader
        title={displayName}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => setRenameOpen(true)}
          >
            이름 변경
          </Button>
        }
      />
      <Card className={cn("grid gap-gap-xlarge md:grid-cols-2", dimmed)}>
        <InfoGrid
          items={[
            { label: "상태", value: getConnectionStatusLabel(account.status) },
            { label: "AWS 계정 ID", value: account.awsAccountId ?? "—" },
            { label: "스택 이름", value: account.stackName },
          ]}
        />
        <InfoGrid
          items={[
            {
              label: "리전",
              value: `${account.regionLabel} ${account.region}`,
            },
            {
              label: "검증 시각",
              value: account.verifiedAt
                ? `${formatKstDateTime(account.verifiedAt)} (KST)`
                : "—",
            },
            { label: "연결 이름", value: displayName },
          ]}
        />
      </Card>
      <ConnectionStatusNotice account={account} />
      <PermissionScanNotice account={account} />
      <section className={cn("flex flex-col gap-gap-medium", dimmed)}>
        <h2 className="text-title-small text-text-strong">
          수집 기록 (최근 20건)
        </h2>
        <SyncJobTable accountId={account.accountId} />
      </section>
      <ConnectionDangerZone account={account} displayName={displayName} />
      <RenameConnectionModal
        accountId={account.accountId}
        currentAlias={account.alias}
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
      />
    </>
  );
}

export function ConnectionDetailScreen({ accountId }: { accountId: string }) {
  const router = useRouter();
  const { data, isPending, error, refetch } = useAwsAccount(accountId);

  let content;
  if (data) content = <ConnectionDetail account={data.account} />;
  else if (isPending)
    content = (
      <>
        <Skeleton shape="text" />
        <Skeleton shape="title" />
        <Skeleton shape="block" className="h-36 w-full" />
      </>
    );
  else if (error instanceof ApiError && error.status === 404)
    content = (
      <EmptyState
        icon="link"
        title="연결을 찾을 수 없어요"
        description="이미 삭제됐거나 다른 사용자의 연결이에요."
        action={{
          label: "연결 목록으로",
          onClick: () => router.push("/settings/connections"),
        }}
      />
    );
  else
    content = (
      <Banner
        title="연결 정보를 불러오지 못했어요"
        description={error?.message}
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );

  return <div className="flex flex-col gap-spacing-medium">{content}</div>;
}
