import { apiRequest } from "./client";

export type AwsAccountStatus = "PENDING" | "ACTIVE" | "ERROR" | "DISCONNECTED";

export type AwsAccount = {
  accountId: string;
  alias: string | null;
  status: AwsAccountStatus;
  region: string;
  regionLabel: string;
  externalId: string;
  roleArn: string | null;
  awsAccountId: string | null;
  lastError: { code: string; message: string } | null;
  verifiedAt: string | null;
  instancesRefreshedAt: string | null;
  usageRefreshedAt: string | null;
  stackId: string | null;
  stackName: string;
  disconnectedAt: string | null;
  createdAt: string;
};

export type RoleSetup = {
  quickCreateUrl: string | null;
  requiredActions: string[];
  stackParameters: Record<string, string>;
  trustPolicy: Record<string, unknown>;
  permissionPolicy: Record<string, unknown>;
  steps: string[];
  warnings: string[];
};

export type AccountSetupResponse = {
  account: AwsAccount;
  roleSetup: RoleSetup;
};

export type CreateAwsAccountRequest = {
  region: string;
  alias?: string;
};

export type DeleteAwsAccountResponse = {
  accountId: string;
  previousStatus: AwsAccountStatus;
  stackName: string;
  awsCleanupNeeded: boolean;
  message: string;
};

export type SyncJobStatus = "SUCCEEDED" | "PARTIAL" | "FAILED";

export type SyncJob = {
  jobId: string;
  trigger: string;
  status: SyncJobStatus;
  instancesRefreshed: boolean;
  usageRefreshed: boolean;
  ec2RequestCount: number;
  cwRequestCount: number;
  instanceCount: number;
  usageRows: number;
  error: { code: string; message: string } | null;
  warning: string | null;
  startedAt: string;
  finishedAt: string | null;
};

export const awsAccountKeys = {
  all: ["awsAccounts"] as const,
  list: (includePending: boolean) =>
    [...awsAccountKeys.all, "list", { includePending }] as const,
  detail: (accountId: string) =>
    [...awsAccountKeys.all, "detail", accountId] as const,
  syncJobs: (accountId: string) =>
    [...awsAccountKeys.all, "syncJobs", accountId] as const,
};

export function listAwsAccounts(includePending: boolean) {
  return apiRequest<AwsAccount[]>(
    `/aws/accounts?includePending=${includePending}`,
  );
}

export function createAwsAccount(input: CreateAwsAccountRequest) {
  return apiRequest<AccountSetupResponse>("/aws/accounts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getAwsAccount(accountId: string) {
  return apiRequest<AccountSetupResponse>(`/aws/accounts/${accountId}`);
}

export function registerAwsAccountRole(accountId: string, roleArn: string) {
  return apiRequest<AwsAccount>(`/aws/accounts/${accountId}/role`, {
    method: "PUT",
    body: JSON.stringify({ roleArn }),
  });
}

export function renameAwsAccount(accountId: string, alias: string) {
  return apiRequest<AwsAccount>(`/aws/accounts/${accountId}`, {
    method: "PATCH",
    body: JSON.stringify({ alias }),
  });
}

export function listSyncJobs(accountId: string) {
  return apiRequest<SyncJob[]>(`/aws/accounts/${accountId}/sync-jobs?limit=20`);
}

export function deleteAwsAccount(accountId: string) {
  return apiRequest<DeleteAwsAccountResponse>(`/aws/accounts/${accountId}`, {
    method: "DELETE",
  });
}
