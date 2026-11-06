"use client";

import type { AwsAccount } from "@/api/awsAccounts";
import type { ReportMonthSummary } from "@/api/reports";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Skeleton } from "@/components/ui/Skeleton";
import { TextLink } from "@/components/ui/TextLink";
import { useReports } from "@/hooks/useReports";
import { useSelectedConnection } from "@/hooks/useSelectedConnection";
import {
  formatMoney,
  formatSignedMoney,
  formatSignedPercent,
} from "@/lib/formatMoney";
import { formatYearMonth } from "@/lib/kstDate";
import { useCurrencyStore } from "@/stores/currencyStore";
import { NoConnectionState } from "./NoConnectionState";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReportEmptyState } from "./ReportEmptyState";

function Muted({ children }: { children: string }) {
  return <span className="text-text-quaternary">{children}</span>;
}

function getColumns(
  currency: "KRW" | "USD",
): DataTableColumn<ReportMonthSummary>[] {
  return [
    {
      key: "month",
      header: "달",
      render: (row) => (
        <span className="flex items-center gap-gap-small">
          {formatYearMonth(row.month)}
          {row.status !== "FINAL" && (
            <Badge tone={row.status === "PREVIEW" ? "info" : "neutral"}>
              {row.statusLabel}
            </Badge>
          )}
        </span>
      ),
    },
    {
      key: "estimatedCost",
      header: "추정 비용",
      align: "right",
      className: "w-45",
      render: (row) =>
        row.estimatedCost === null ? (
          <Muted>—</Muted>
        ) : (
          formatMoney(row.estimatedCost, currency)
        ),
    },
    {
      key: "change",
      header: "전월 대비",
      align: "right",
      className: "w-55",
      render: (row) =>
        row.change === null ? (
          <Muted>—</Muted>
        ) : (
          `${row.changeRate === null ? "" : `${formatSignedPercent(row.changeRate)} `}(${formatSignedMoney(row.change, currency)})`
        ),
    },
    {
      key: "link",
      header: <span className="sr-only">리포트</span>,
      align: "right",
      className: "w-30",
      render: (row) =>
        row.status === "EMPTY" ? (
          <Muted>기록 없음</Muted>
        ) : (
          <TextLink href={`/reports/${row.month}`}>
            {row.status === "PREVIEW" ? "미리 보기" : "보기"}
          </TextLink>
        ),
    },
  ];
}

function ReportListBody({ connection }: { connection: AwsAccount }) {
  const currency = useCurrencyStore((state) => state.currency);
  const { data, isPending, isError, error, refetch } = useReports(
    connection.accountId,
    currency,
  );

  if (isPending) return <Skeleton shape="block" className="h-72 w-full" />;
  if (isError)
    return (
      <Banner
        title="월간 리포트를 불러오지 못했어요"
        description={error.message}
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  if (data.months.length === 0) return <ReportEmptyState reason="noRecord" />;

  const notes = [
    "금액은 사용 시간 × 온디맨드 단가로 계산한 추정치예요",
    ...(data.availableFrom
      ? [`기록 시작일(${data.availableFrom}) 이전 달은 리포트가 없어요`]
      : []),
    ...data.notes,
  ];

  return (
    <>
      <DataTable
        caption="월간 리포트 목록"
        columns={getColumns(data.currency)}
        rows={data.months}
        getRowKey={(row) => row.month}
      />
      <ul className="flex flex-wrap gap-x-gap-large gap-y-gap-xxsmall text-subtext-small text-text-quaternary">
        {notes.map((note) => (
          <li key={note}>· {note}</li>
        ))}
      </ul>
    </>
  );
}

export function ReportListScreen() {
  const { selected, isPending, error, refetch } = useSelectedConnection();

  let body;
  if (isPending) body = <Skeleton shape="block" className="h-72 w-full" />;
  else if (error)
    body = (
      <Banner
        title="연결 목록을 불러오지 못했어요"
        description={error.message}
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  else if (!selected) body = <NoConnectionState />;
  else body = <ReportListBody key={selected.accountId} connection={selected} />;

  return (
    <div className="flex flex-col gap-spacing-medium">
      <PageHeader
        title="월간 리포트"
        description="매달 비용과 절감 제안을 한 장으로 정리해요."
      />
      {body}
    </div>
  );
}
