"use client";

import { useState } from "react";
import type { Currency } from "@/api/costs";
import type { DailyCostWithInstances } from "./DashboardScreen";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SidePanel } from "@/components/ui/SidePanel";
import { StatCard } from "@/components/ui/StatCard";
import { formatMoney } from "@/lib/formatMoney";
import { ServerCostTable } from "./ServerCostTable";
import { formatHours, formatLongDateWithWeekday } from "./dashboardFormat";

type DayDetailPanelProps = {
  day: DailyCostWithInstances | null;
  currency: Currency;
  onClose: () => void;
  onMove: (offset: -1 | 1) => void;
};

export function DayDetailPanel({
  day: currentDay,
  currency,
  onClose,
  onMove,
}: DayDetailPanelProps) {
  const [lastDay, setLastDay] = useState(currentDay);
  if (currentDay && currentDay !== lastDay) setLastDay(currentDay);
  const day = currentDay ?? lastDay;
  if (!day) return null;
  return (
    <SidePanel
      open={currentDay !== null}
      onClose={onClose}
      title={formatLongDateWithWeekday(day.date)}
      badge={day.spike ? <Badge tone="danger">급증</Badge> : undefined}
      className="w-160"
      footer={
        <>
          <Button
            variant="assistive"
            className="flex-1"
            onClick={() => onMove(-1)}
          >
            이전
          </Button>
          <Button
            variant="assistive"
            className="flex-1"
            onClick={() => onMove(1)}
          >
            다음
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-3 gap-gap-medium">
        <StatCard
          label="비용"
          value={
            day.estimatedCost === null
              ? "—"
              : formatMoney(day.estimatedCost, currency)
          }
        />
        <StatCard label="사용 시간" value={formatHours(day.usageHours)} />
        <StatCard
          label="평소 대비"
          value={
            day.spike ? (
              <span className="text-text-danger">{day.spike.ratio}배</span>
            ) : (
              "평소 범위"
            )
          }
        />
      </div>
      <section className="flex flex-col gap-gap-medium">
        <h3 className="text-title-xsmall text-text-strong">서버별 비용</h3>
        <ServerCostTable rows={day.instances} currency={currency} />
        {day.spike?.causeName && (
          <p className="text-subtext-medium text-text-tertiary">
            {day.spike.causeName} 사용 시간이{" "}
            {day.spike.causeUsageHours !== null &&
            day.spike.causeBaselineHours !== null
              ? `평소 ${formatHours(day.spike.causeBaselineHours)}에서 ${formatHours(day.spike.causeUsageHours)}으로`
              : "평소보다"}{" "}
            늘어 비용 증가에 가장 크게 영향을 줬어요.
          </p>
        )}
      </section>
    </SidePanel>
  );
}
