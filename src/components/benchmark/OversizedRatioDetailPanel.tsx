"use client";

import type { BenchmarkOversizedRatio, BenchmarkServer } from "@/api/benchmark";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Panel } from "@/components/ui/Panel";
import { SidePanel } from "@/components/ui/SidePanel";
import { StatCard } from "@/components/ui/StatCard";
import { formatPercent } from "./benchmarkFormat";

type OversizedRatioDetailPanelProps = {
  open: boolean;
  onClose: () => void;
  oversizedRatio: BenchmarkOversizedRatio;
};

const columns: DataTableColumn<BenchmarkServer>[] = [
  {
    key: "name",
    header: "서버",
    render: (server) => server.name ?? server.instanceId,
  },
  {
    key: "cpuP95",
    header: "CPU P95",
    className: "w-24",
    render: (server) => `${server.cpuP95}%`,
  },
  {
    key: "verdict",
    header: "판정",
    className: "w-36",
    render: (server) =>
      server.oversized ? (
        <Badge tone="brand">{server.verdict}</Badge>
      ) : (
        <span className="text-subtext-medium text-text-tertiary">
          {server.verdict}
        </span>
      ),
  },
];

export function OversizedRatioDetailPanel({
  open,
  onClose,
  oversizedRatio,
}: OversizedRatioDetailPanelProps) {
  const { ours, reference, moreEfficientTeamsPercent, servers } =
    oversizedRatio;
  const sampleSize = reference.sampleSize.toLocaleString("ko-KR");

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="① 컴퓨팅 과다 사양 비율"
      className="w-130"
      footer={
        <ButtonLink className="flex-1" href="/savings/waste">
          낭비 리소스에서 보기
        </ButtonLink>
      }
    >
      <div className="flex flex-col gap-gap-xlarge">
        <p className="text-subtext-medium text-text-tertiary">
          최근 14일 CPU 사용률(P95)이 10% 미만인 서버가 전체 서버 중 몇 %인지
          봐요.
        </p>
        <div className="flex gap-gap-medium">
          <StatCard
            size="small"
            label="우리 팀"
            value={
              <span className="text-text-brand">
                {ours
                  ? `${formatPercent(ours.ratio)} (${ours.judgedCount}대 중 ${ours.oversizedCount}대)`
                  : "—"}
              </span>
            }
            className="flex-1"
          />
          <StatCard
            size="small"
            label="비교 팀 중앙값"
            value={formatPercent(reference.medianRatio)}
            className="flex-1"
          />
        </div>
        <div className="flex flex-col gap-gap-medium">
          <h3 className="text-title-xsmall text-text-strong">해당 서버</h3>
          <DataTable
            caption="과다 사양 판정 서버 목록"
            columns={columns}
            rows={servers}
            getRowKey={(server) => server.instanceId}
          />
        </div>
        <Panel className="flex flex-col gap-gap-small">
          <p className="text-label-xsmall text-text-strong">
            어떻게 비교했나요?
          </p>
          <ul className="text-subtext-medium text-text-secondary">
            <li>
              · 비교 대상: {reference.source}에서 {reference.sizeBandLabel}를
              쓰는 구독 {sampleSize}곳 (평균{" "}
              {formatPercent(reference.averageRatio)}, 중앙값{" "}
              {formatPercent(reference.medianRatio)})
            </li>
            {moreEfficientTeamsPercent !== null && ours && (
              <li>
                · &quot;우리보다 효율적인 팀 {moreEfficientTeamsPercent}%&quot;
                = {sampleSize}곳 중 과다 사양 비율이 우리(
                {formatPercent(ours.ratio)})보다 낮은 곳의 비율
              </li>
            )}
            <li>
              · 공개 데이터라 업종·지역이 우리와 다를 수 있어요. 참고용으로 봐
              주세요.
            </li>
          </ul>
        </Panel>
      </div>
    </SidePanel>
  );
}
