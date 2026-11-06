"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AwsAccount } from "@/api/awsAccounts";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { useDeleteAwsAccount } from "@/hooks/useAwsAccounts";
import { getCloudFormationStacksUrl, openInNewTab } from "@/lib/awsConsole";

type ConnectionDangerZoneProps = {
  account: AwsAccount;
  displayName: string;
};

export function ConnectionDangerZone({
  account,
  displayName,
}: ConnectionDangerZoneProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteAccount = useDeleteAwsAccount();
  const result = deleteAccount.data;

  function confirmDelete() {
    deleteAccount.mutate(account.accountId, {
      onSettled: () => setConfirmOpen(false),
    });
  }

  function finish() {
    router.replace("/settings/connections");
  }

  return (
    <>
      <Card className="flex-row flex-wrap items-center gap-gap-xlarge">
        <div className="flex min-w-0 flex-1 flex-col gap-gap-xsmall">
          <h2 className="text-title-xsmall text-text-strong">연결 삭제</h2>
          <p className="text-subtext-medium text-text-tertiary">
            우리 서비스에 저장된 이 연결의 데이터만 지워요. AWS 계정에 만든
            스택(읽기 전용 역할)은 AWS 콘솔에서 직접 삭제해야 해요.
          </p>
        </div>
        <Button
          variant="danger"
          size="medium"
          onClick={() => setConfirmOpen(true)}
        >
          연결 삭제
        </Button>
      </Card>
      {deleteAccount.isError && (
        <Banner
          title="연결을 삭제하지 못했어요"
          description={deleteAccount.error.message}
        />
      )}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="연결을 삭제할까요?"
        description={`'${displayName}' 연결과 저장된 사용량·비용 데이터가 삭제돼요. 되돌릴 수 없어요. AWS 계정에 만든 스택(읽기 전용 역할)은 그대로 남아 있어요.`}
        tone="danger"
        cancelLabel="취소"
        confirmLabel="삭제"
        confirmLoading={deleteAccount.isPending}
      />
      <Modal
        open={Boolean(result)}
        onClose={finish}
        title="연결을 삭제했어요"
        className="w-100"
      >
        <div className="flex flex-col gap-gap-large px-padding-xlarge pt-padding-small pb-padding-xlarge">
          <p className="rounded-large bg-background-lower p-padding-medium text-subtext-medium text-text-secondary">
            {result?.message}
          </p>
          <div className="flex items-center justify-between gap-gap-small">
            {result?.awsCleanupNeeded ? (
              <Button
                variant="secondary"
                size="medium"
                icon="external-link"
                onClick={() =>
                  openInNewTab(getCloudFormationStacksUrl(account.region))
                }
              >
                AWS 콘솔 열기
              </Button>
            ) : (
              <span />
            )}
            <Button size="medium" onClick={finish} data-autofocus>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
