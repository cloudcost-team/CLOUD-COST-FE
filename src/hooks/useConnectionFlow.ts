"use client";

import { useEffect, useState } from "react";
import type { AwsAccount, CreateAwsAccountRequest } from "@/api/awsAccounts";
import { ApiError } from "@/api/client";
import { trackEvent } from "@/lib/analytics";
import {
  useAwsAccount,
  useCreateAwsAccount,
  useDeleteAwsAccount,
  useRegisterAwsAccountRole,
} from "./useAwsAccounts";

const LATE_AFTER_MS = 2 * 60_000;
const TIMEOUT_AFTER_MS = 10 * 60_000;

export type WaitPhase = "normal" | "late" | "timeout";

export type ConnectionFailure = {
  code?: string;
  message: string;
  guide: string;
};

function getFailure(
  account: AwsAccount,
  waitPhase: WaitPhase,
): ConnectionFailure | null {
  if (account.status === "ERROR" && account.lastError)
    return {
      code: account.lastError.code,
      message: account.lastError.message,
      guide: "AWS 계정에 만들어진 스택은 자동으로 롤백돼서 역할이 남지 않아요.",
    };
  if (account.status === "DISCONNECTED")
    return {
      message: "스택이 삭제되어 연결이 끊겼어요.",
      guide: "처음부터 다시 연결해 주세요.",
    };
  if (account.status === "PENDING" && waitPhase === "timeout")
    return {
      message: "10분이 지나도록 스택 생성 신호가 오지 않았어요.",
      guide: `AWS 콘솔 → CloudFormation → 스택 ${account.stackName} → [이벤트] 탭에서 '상태 사유'를 확인해 주세요.`,
    };
  return null;
}

function getFailureReason(
  account: AwsAccount,
  failure: ConnectionFailure | null,
) {
  if (account.status === "ERROR") return account.lastError?.code ?? "ERROR";
  if (!failure) return null;
  return account.status === "PENDING" ? "TIMEOUT" : account.status;
}

export function useConnectionFlow() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [waitPhase, setWaitPhase] = useState<WaitPhase>("normal");
  const [roleArnFormOpen, setRoleArnFormOpen] = useState(false);
  const createAccount = useCreateAwsAccount();
  const accountQuery = useAwsAccount(accountId);
  const registerRole = useRegisterAwsAccountRole();
  const deleteAccount = useDeleteAwsAccount();

  useEffect(() => {
    if (!accountId) return;
    const lateTimer = setTimeout(() => setWaitPhase("late"), LATE_AFTER_MS);
    const timeoutTimer = setTimeout(
      () => setWaitPhase("timeout"),
      TIMEOUT_AFTER_MS,
    );
    return () => {
      clearTimeout(lateTimer);
      clearTimeout(timeoutTimer);
    };
  }, [accountId]);

  function start(values: CreateAwsAccountRequest) {
    const consoleTab = window.open("", "_blank");
    trackEvent("aws_connect_start");
    createAccount.mutate(values, {
      onSuccess: ({ account, roleSetup }) => {
        setWaitPhase("normal");
        setRoleArnFormOpen(roleSetup.quickCreateUrl === null);
        setAccountId(account.accountId);
        if (consoleTab && roleSetup.quickCreateUrl) {
          consoleTab.opener = null;
          consoleTab.location.href = roleSetup.quickCreateUrl;
        } else consoleTab?.close();
      },
      onError: (error) => {
        consoleTab?.close();
        trackEvent("aws_connect_fail", {
          reason: (error instanceof ApiError && error.code) || "CREATE_FAILED",
        });
      },
    });
  }

  function reset() {
    setAccountId(null);
    setRoleArnFormOpen(false);
    createAccount.reset();
    registerRole.reset();
  }

  function cancel() {
    if (!accountId) return;
    deleteAccount.mutate(accountId, { onSettled: reset });
  }

  function submitRoleArn(roleArn: string) {
    if (accountId) registerRole.mutate({ accountId, roleArn });
  }

  function recheck() {
    const roleArn = accountQuery.data?.account.roleArn;
    if (roleArn) submitRoleArn(roleArn);
    else accountQuery.refetch();
  }

  const account = accountQuery.data?.account;
  const createError = createAccount.error;
  const status = account?.status;
  const failure = account ? getFailure(account, waitPhase) : null;
  const failureReason = account && getFailureReason(account, failure);

  useEffect(() => {
    if (status === "ACTIVE") trackEvent("aws_connect_success");
  }, [status]);

  useEffect(() => {
    if (failureReason)
      trackEvent("aws_connect_fail", { reason: failureReason });
  }, [failureReason]);

  return {
    accountId,
    setup: accountQuery.data,
    accountQuery,
    waitPhase,
    failure,
    roleArnFormOpen,
    openRoleArnForm: () => setRoleArnFormOpen(true),
    start,
    starting: createAccount.isPending,
    startError: createError && {
      code: createError instanceof ApiError ? createError.code : undefined,
      message: createError.message,
    },
    cancel,
    cancelling: deleteAccount.isPending,
    submitRoleArn,
    recheck,
    registering: registerRole.isPending,
    registerError: registerRole.error?.message,
  };
}
