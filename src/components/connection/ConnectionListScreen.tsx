"use client";

import { useRouter } from "next/navigation";
import type { AwsAccount } from "@/api/awsAccounts";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { TextLink } from "@/components/ui/TextLink";
import { useAwsAccounts } from "@/hooks/useAwsAccounts";
import { formatKstDateTime } from "@/lib/kstDate";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ConnectionStatusBadge } from "./ConnectionStatusBadge";
import { PageHeader } from "@/components/layout/PageHeader";

function Muted({ children }: { children: string }) {
  return (
    <span className="text-subtext-medium text-text-tertiary">{children}</span>
  );
}

const COLUMNS: DataTableColumn<AwsAccount>[] = [
  {
    key: "alias",
    header: "연결 이름",
    render: (account) => account.alias ?? <Muted>이름 없는 연결</Muted>,
  },
  {
    key: "awsAccountId",
    header: "AWS 계정 ID",
    align: "center",
    className: "w-60",
    render: (account) => account.awsAccountId ?? <Muted>—</Muted>,
  },
  {
    key: "region",
    header: "리전",
    align: "center",
    className: "w-28",
    render: (account) => account.regionLabel,
  },
  {
    key: "status",
    header: "상태",
    align: "center",
    className: "w-32",
    render: (account) => <ConnectionStatusBadge status={account.status} />,
  },
  {
    key: "usageRefreshedAt",
    header: "마지막 수집 (KST)",
    align: "center",
    className: "w-64",
    render: (account) =>
      account.usageRefreshedAt ? (
        formatKstDateTime(account.usageRefreshedAt)
      ) : (
        <Muted>—</Muted>
      ),
  },
  {
    key: "detail",
    header: <span className="sr-only">상세</span>,
    className: "w-20",
    align: "right",
    render: (account) => (
      <TextLink href={`/settings/connections/${account.accountId}`}>
        상세
      </TextLink>
    ),
  },
];

function ConnectionListBody() {
  const router = useRouter();
  const { data, isPending, isError, error, refetch } = useAwsAccounts(false);

  if (isPending) return <Skeleton shape="block" className="h-60 w-full" />;
  if (isError)
    return (
      <Banner
        title="연결 목록을 불러오지 못했어요"
        description={error.message}
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  const connections = data.filter((account) => account.status !== "PENDING");
  if (connections.length === 0)
    return (
      <EmptyState
        icon="link"
        title="아직 연결한 AWS 계정이 없어요"
        description="새 연결을 만들면 EC2 사용 시간과 비용을 볼 수 있어요."
        action={{
          label: "새 연결",
          onClick: () => router.push("/settings/connections/new"),
        }}
      />
    );
  return (
    <DataTable
      caption="AWS 연결 목록"
      columns={COLUMNS}
      rows={connections}
      getRowKey={(account) => account.accountId}
      isRowDimmed={(account) => account.status === "DISCONNECTED"}
    />
  );
}

export function ConnectionListScreen() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-spacing-medium">
      <Breadcrumb items={[{ label: "설정" }, { label: "데이터 연결" }]} />
      <PageHeader
        title="데이터 연결"
        description="연결한 AWS 계정을 관리해요. 비용 화면은 헤더에서 연결을 골라 봐요."
        actions={
          <Button
            size="medium"
            icon="plus"
            onClick={() => router.push("/settings/connections/new")}
          >
            새 연결
          </Button>
        }
      />
      <ConnectionListBody />
    </div>
  );
}
