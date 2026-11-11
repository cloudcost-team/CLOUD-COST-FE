import type { AwsAccount } from "./awsAccounts";
import { apiRequest } from "./client";
import type { DemoSetupRequest } from "./demo";

export type DataSource =
  | { kind: "aws"; account: AwsAccount }
  | { kind: "demo"; setup: DemoSetupRequest };

export function getSourceKey(source: DataSource) {
  return source.kind === "aws" ? source.account.accountId : source.setup;
}

export function getSourceId(source: DataSource) {
  return source.kind === "aws" ? source.account.accountId : "demo";
}

export function requestFromSource<T>(
  source: DataSource,
  path: string,
  params: URLSearchParams,
  demoExtra?: Partial<DemoSetupRequest>,
) {
  if (source.kind === "aws")
    return apiRequest<T>(
      `/aws/accounts/${source.account.accountId}${path}?${params}`,
    );
  return apiRequest<T>(`/demo${path}?${params}`, {
    method: "POST",
    body: JSON.stringify({ ...source.setup, ...demoExtra }),
  });
}
