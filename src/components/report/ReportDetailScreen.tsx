"use client";

import { useRouter } from "next/navigation";
import type { DataSource } from "@/api/dataSource";
import type { ReportDetailResponse } from "@/api/reports";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { Panel } from "@/components/ui/Panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { useReport, useReports } from "@/hooks/useReports";
import { useAppPath } from "@/hooks/useAppMode";
import {
  formatMoney,
  formatSignedMoney,
  formatSignedPercent,
} from "@/lib/formatMoney";
import {
  formatKoreanMonthDay,
  formatMonthDay,
  formatYearMonth,
  getMonthNumber,
  shiftYearMonth,
} from "@/lib/kstDate";
import { useCurrencyStore } from "@/stores/currencyStore";
import { DataSourceGate } from "@/components/layout/DataSourceGate";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReportDailyChart } from "./ReportDailyChart";
import { ReportEmptyState } from "./ReportEmptyState";
import { ReportServerShare } from "./ReportServerShare";
import { SavingsSuggestionList } from "./SavingsSuggestionList";

function getStatusNotice(report: ReportDetailResponse) {
  const month = getMonthNumber(report.month);
  if (report.status === "PREVIEW")
    return `${month}월은 아직 진행 중이에요. ${formatKoreanMonthDay(report.to)}까지 기록으로 만든 미리 보기예요. ${getMonthNumber(shiftYearMonth(report.month, 1))}월 1일에 확정돼요.`;
  if (report.status === "FIRST_MONTH")
    return `${formatKoreanMonthDay(report.from)}부터 기록을 시작했어요. 이전 달 데이터가 없어 이번 달은 전월 비교를 제공하지 않아요.`;
  return null;
}

function ReportStats({ report }: { report: ReportDetailResponse }) {
  const currency = report.currency ?? "KRW";
  const { summary, spikes } = report;
  const month = getMonthNumber(report.month);
  const previousMonth = getMonthNumber(shiftYearMonth(report.month, -1));
  const firstSpike = spikes.days[0];

  return (
    <div className="grid gap-gap-large md:grid-cols-3">
      <StatCard
        label={`${month}월 추정 비용`}
        value={
          summary.estimatedCost === null
            ? "—"
            : formatMoney(summary.estimatedCost, currency)
        }
        caption={
          report.exchangeRate &&
          `${report.exchangeRate.date} 환율로 환산한 추정치`
        }
      />
      <StatCard
        label="전월 대비"
        value={
          summary.changeRate === null
            ? "—"
            : formatSignedPercent(summary.changeRate)
        }
        caption={
          summary.change === null
            ? report.status === "FIRST_MONTH"
              ? "첫 달이라 비교하지 않아요"
              : "전월 기록이 없어요"
            : `${previousMonth}월 대비 ${formatSignedMoney(summary.change, currency)}`
        }
      />
      <StatCard
        label="급증일"
        value={`${spikes.count}일`}
        caption={
          firstSpike
            ? `${formatMonthDay(firstSpike.date)} · 평소의 ${firstSpike.ratio}배`
            : "급증한 날이 없어요"
        }
      />
    </div>
  );
}

function ReportSpikes({ report }: { report: ReportDetailResponse }) {
  if (report.spikes.days.length === 0)
    return (
      <Panel as="p" className="text-subtext-medium text-text-tertiary">
        이 달에는 급증한 날이 없어요.
      </Panel>
    );
  return (
    <ul className="flex flex-col gap-gap-small">
      {report.spikes.days.map((day) => (
        <Panel
          as="li"
          key={day.date}
          variant="danger"
          className="flex flex-col gap-gap-xxsmall"
        >
          <p className="text-label-small text-text-strong">
            {formatMonthDay(day.date)} · 평소의 {day.ratio}배
          </p>
          <p className="text-subtext-medium text-text-secondary">
            {day.message}
          </p>
        </Panel>
      ))}
    </ul>
  );
}

function getSourceLabel(source: DataSource) {
  if (source.kind === "demo") return "체험 데이터";
  const { alias, regionLabel } = source.account;
  return `${alias ?? "이름 없는 연결"} · ${regionLabel}`;
}

function ReportBody({
  report,
  source,
}: {
  report: ReportDetailResponse;
  source: DataSource;
}) {
  const currency = report.currency ?? "KRW";
  const notice = getStatusNotice(report);
  const monthLabel = `${getMonthNumber(report.month)}월`;

  return (
    <Card className="gap-spacing-medium p-padding-xxlarge">
      <div className="flex flex-wrap items-center justify-between gap-gap-small">
        <div className="flex items-center gap-gap-small">
          <h2 className="text-title-medium text-text-strong">
            {formatYearMonth(report.month)} 비용 리포트
          </h2>
          {report.status !== "FINAL" && (
            <Badge tone="info">
              {report.status === "PREVIEW" ? "이번 달" : report.statusLabel}
            </Badge>
          )}
        </div>
        <p className="text-subtext-medium text-text-tertiary">
          {getSourceLabel(source)}
        </p>
      </div>
      {notice && <Banner tone="info" title={notice} />}
      <ReportStats report={report} />
      <div className="flex flex-col gap-spacing-medium lg:flex-row">
        <ReportServerShare servers={report.topServers} currency={currency} />
        <section className="flex min-w-0 flex-1 flex-col gap-gap-medium">
          <h2 className="text-title-xsmall text-text-strong">급증일</h2>
          <ReportSpikes report={report} />
          <ReportDailyChart
            source={source}
            from={report.from}
            to={report.to}
            monthLabel={monthLabel}
            currency={currency}
          />
        </section>
      </div>
      {report.savings && (
        <SavingsSuggestionList
          savings={report.savings}
          currency={currency}
          source={source}
        />
      )}
      <ul className="flex flex-col gap-gap-xxsmall text-subtext-small text-text-quaternary">
        <li>
          사용 시간 × 온디맨드 단가로 계산한 추정치예요. RI·Savings Plans·Spot
          할인, EBS·데이터 전송 비용은 포함하지 않아요.
        </li>
        {report.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </Card>
  );
}

function ReportDetail({
  source,
  month,
}: {
  source: DataSource;
  month: string;
}) {
  const router = useRouter();
  const appPath = useAppPath();
  const currency = useCurrencyStore((state) => state.currency);
  const reports = useReports(source, currency);
  const report = useReport(source, month, currency);
  const months = reports.data?.months ?? [];

  let body;
  if (report.isPending)
    body = <Skeleton shape="block" className="h-96 w-full" />;
  else if (report.isError)
    body = (
      <Banner
        title="리포트를 불러오지 못했어요"
        description={report.error.message}
        action={{ label: "다시 시도", onClick: () => report.refetch() }}
      />
    );
  else if (report.data.status === "EMPTY")
    body = <ReportEmptyState reason="emptyMonth" />;
  else body = <ReportBody report={report.data} source={source} />;

  return (
    <>
      <div className="flex flex-wrap items-center gap-gap-large">
        <PageHeader title="월간 리포트" className="flex-1" />
        {months.length > 0 && (
          <Select
            value={month}
            onValueChange={(value) => router.push(appPath(`/reports/${value}`))}
          >
            <SelectTrigger
              aria-label="리포트 달"
              className="h-12 w-45 px-padding-medium text-subtext-large text-text-strong"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((item) => (
                <SelectItem key={item.month} value={item.month}>
                  {formatYearMonth(item.month)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      {body}
    </>
  );
}

export function ReportDetailScreen({ month }: { month: string }) {
  return (
    <div className="flex animate-slide-in-right flex-col gap-spacing-medium motion-reduce:animate-none">
      <DataSourceGate
        loading={<Skeleton shape="block" className="h-96 w-full" />}
      >
        {(source) => <ReportDetail source={source} month={month} />}
      </DataSourceGate>
    </div>
  );
}
