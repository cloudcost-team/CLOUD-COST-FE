"use client";

import type { Currency } from "@/api/costs";
import { useAppPath } from "@/hooks/useAppMode";
import type { WasteInstanceSpec, WasteItem } from "@/api/waste";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Callout } from "@/components/ui/Callout";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { NumberedSteps } from "@/components/ui/NumberedSteps";
import { Panel } from "@/components/ui/Panel";
import { SidePanel } from "@/components/ui/SidePanel";
import { formatMoney } from "@/lib/formatMoney";
import { CpuUsageChart } from "./CpuUsageChart";
import { getSimulatorHref } from "./RecommendationCard";
import { WasteKindBadge } from "./WasteKindBadge";

type RecommendationDetailPanelProps = {
  item: WasteItem | null;
  currency: Currency;
  open: boolean;
  onClose: () => void;
};

type SpecRow = {
  key: string;
  label: string;
  current: string;
  recommended: string;
};

function getSpecRows(
  current: WasteInstanceSpec,
  recommended: WasteInstanceSpec | null,
  currency: Currency,
): SpecRow[] {
  return [
    {
      key: "vcpu",
      label: "vCPU",
      current: String(current.vcpu),
      recommended: recommended ? String(recommended.vcpu) : "—",
    },
    {
      key: "memory",
      label: "메모리",
      current: `${current.memoryGib} GiB`,
      recommended: recommended ? `${recommended.memoryGib} GiB` : "—",
    },
    {
      key: "hourly",
      label: "시간당 단가",
      current: formatMoney(current.hourlyCost, currency),
      recommended: recommended
        ? formatMoney(recommended.hourlyCost, currency)
        : "—",
    },
    {
      key: "monthly",
      label: "월 비용 (730시간)",
      current: formatMoney(current.monthlyCostAt730h, currency),
      recommended: recommended
        ? formatMoney(recommended.monthlyCostAt730h, currency)
        : "—",
    },
  ];
}

export function RecommendationDetailPanel({
  item,
  currency,
  open,
  onClose,
}: RecommendationDetailPanelProps) {
  const appPath = useAppPath();
  if (!item) return null;
  const rows = getSpecRows(
    item.comparison.current,
    item.comparison.recommended,
    currency,
  );
  const columns: DataTableColumn<SpecRow>[] = [
    {
      key: "label",
      header: "항목",
      align: "center",
      render: (row) => row.label,
    },
    {
      key: "current",
      header: `지금 · ${item.comparison.current.instanceType}`,
      align: "center",
      render: (row) => row.current,
    },
    {
      key: "recommended",
      header: item.comparison.recommended
        ? `추천 · ${item.comparison.recommended.instanceType}`
        : "추천",
      align: "center",
      render: (row) => (
        <span className="text-text-brand">{row.recommended}</span>
      ),
    },
  ];

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={item.name ?? item.instanceId}
      badge={<WasteKindBadge kind={item.kind} kindLabel={item.kindLabel} />}
      className="w-140"
      footer={
        <>
          <ButtonLink
            variant="secondary"
            size="large"
            icon="external-link"
            className="flex-1"
            href="https://console.aws.amazon.com/ec2/home"
            external
          >
            AWS 콘솔 열기
          </ButtonLink>
          <ButtonLink
            size="large"
            className="flex-1"
            href={appPath(getSimulatorHref(item.recommendationId))}
          >
            시뮬레이터에서 효과 보기
          </ButtonLink>
        </>
      }
    >
      <Panel as="section" variant="brand">
        <p className="text-label-xsmall text-text-brand">추천 조치</p>
        <p className="mt-gap-xsmall text-title-xsmall text-text-strong">
          {item.action}
        </p>
        <p className="mt-gap-xxsmall text-subtext-medium text-text-tertiary">
          {formatMoney(item.estimatedMonthlySavings, currency)} 매달 절감 예상
        </p>
      </Panel>
      <Panel as="section" variant="outline-brand">
        <div className="mb-gap-medium flex items-center gap-gap-small">
          <Badge tone="brand">추천 이유</Badge>
          <p className="text-subtext-medium text-text-tertiary">
            이 서버에 이 조치를 추천하는 근거예요
          </p>
        </div>
        <NumberedSteps
          steps={item.summary.map((line) => `${line.title} · ${line.detail}`)}
        />
        {item.summaryNote && (
          <Callout className="mt-gap-medium bg-fill-warning-weak">
            {item.summaryNote}
          </Callout>
        )}
      </Panel>
      <section className="flex flex-col gap-gap-medium">
        <h3 className="text-title-xsmall text-text-strong">
          탐지 근거 · 최근 14일 CPU 사용률
        </h3>
        <CpuUsageChart chart={item.cpuChart} metrics={item.metrics} />
      </section>
      <section className="flex flex-col gap-gap-medium">
        <h3 className="text-title-xsmall text-text-strong">사양 비교</h3>
        <DataTable columns={columns} rows={rows} getRowKey={(row) => row.key} />
      </section>
      <Panel as="section" variant="warning">
        <h3 className="text-label-small text-text-warning">
          바꾸기 전에 확인해 주세요
        </h3>
        <ul className="mt-gap-small flex list-disc flex-col gap-gap-xsmall pl-padding-large text-subtext-medium text-text-secondary">
          {item.cautions.map((caution) => (
            <li key={caution}>{caution}</li>
          ))}
        </ul>
      </Panel>
      <section className="flex flex-col gap-gap-medium">
        <h3 className="text-title-xsmall text-text-strong">
          AWS 콘솔에서 직접 바꾸는 방법
        </h3>
        <NumberedSteps steps={item.consoleSteps} />
      </section>
    </SidePanel>
  );
}
