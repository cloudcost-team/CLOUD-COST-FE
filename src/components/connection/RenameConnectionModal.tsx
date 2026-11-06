"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useRenameAwsAccount } from "@/hooks/useAwsAccounts";

const ALIAS_MAX_LENGTH = 40;

type RenameConnectionModalProps = {
  accountId: string;
  currentAlias: string | null;
  open: boolean;
  onClose: () => void;
};

export function RenameConnectionModal({
  accountId,
  currentAlias,
  open,
  onClose,
}: RenameConnectionModalProps) {
  const [alias, setAlias] = useState(currentAlias ?? "");
  const rename = useRenameAwsAccount();

  function close() {
    rename.reset();
    setAlias(currentAlias ?? "");
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    rename.mutate({ accountId, alias: alias.trim() }, { onSuccess: onClose });
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="연결 이름 변경"
      description="비워 두면 '이름 없는 연결'로 보여요."
    >
      <form onSubmit={handleSubmit}>
        <div className="px-padding-xlarge pt-padding-small">
          <Input
            label="연결 이름"
            placeholder="예: 운영 서버"
            maxLength={ALIAS_MAX_LENGTH}
            showCounter
            value={alias}
            onChange={(event) => setAlias(event.currentTarget.value)}
            error={rename.error?.message}
          />
        </div>
        <div className="flex gap-gap-small px-padding-medium pt-padding-xlarge pb-padding-medium">
          <Button
            variant="assistive"
            onClick={close}
            className="flex-1 rounded-full"
          >
            취소
          </Button>
          <Button
            type="submit"
            loading={rename.isPending}
            className="flex-1 rounded-full"
          >
            저장
          </Button>
        </div>
      </form>
    </Modal>
  );
}
