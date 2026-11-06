"use client";

import type { SyncJob, SyncJobStatus } from "@/api/awsAccounts";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSyncJobs } from "@/hooks/useAwsAccounts";
import { formatKstDateTime } from "@/lib/kstDate";

const STATUS_BADGES: Record<SyncJobStatus, { label: string; tone: BadgeTone }> =
  {
    SUCCEEDED: { label: "성공", tone: "success" },
    PARTIAL: { label: "일부 성공", tone: "warning" },
    FAILED: { label: "실패", tone: "danger" },
  };

function Muted({ children }: { children: string }) {
  return (
    <span className="text-subtext-medium text-text-tertiary">{children}</span>
  );
}

const COLUMNS: DataTableColumn<SyncJob>[] = [
  {
    key: "status",
    header: "결과",
    className: "w-50",
    render: (job) => (
      <Badge tone={STATUS_BADGES[job.status].tone}>
        {STATUS_BADGES[job.status].label}
      </Badge>
    ),
  },
  {
    key: "startedAt",
    header: "시작 (KST)",
    className: "w-40 whitespace-nowrap",
    render: (job) => formatKstDateTime(job.startedAt),
  },
  {
    key: "finishedAt",
    header: "종료 (KST)",
    className: "w-40 whitespace-nowrap",
    render: (job) =>
      job.finishedAt ? formatKstDateTime(job.finishedAt) : <Muted>—</Muted>,
  },
  {
    key: "message",
    header: "오류 · 경고",
    className: "break-words",
    render: (job) => {
      if (job.error) return job.error.message;
      if (job.warning) return `경고: ${job.warning}`;
      return <Muted>—</Muted>;
    },
  },
];

export function SyncJobTable({ accountId }: { accountId: string }) {
  const { data, isPending, isError, error, refetch } = useSyncJobs(accountId);

  if (isPending) return <Skeleton shape="block" className="h-48 w-full" />;
  if (isError)
    return (
      <Banner
        title="수집 기록을 불러오지 못했어요"
        description={error.message}
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  if (data.length === 0)
    return (
      <EmptyState
        icon="clock"
        title="아직 수집 기록이 없어요"
        description="비용 화면을 열면 AWS에서 사용 기록을 가져오고 여기에 남아요."
      />
    );
  return (
    <DataTable
      caption="수집 기록"
      columns={COLUMNS}
      rows={data}
      getRowKey={(job) => job.jobId}
    />
  );
}
