"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { Currency } from "@/api/costs";
import type { ReportTopServer } from "@/api/reports";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/formatMoney";

const SLICE_COLORS = [
  { fill: "var(--color-fill-brand)", dot: "bg-fill-brand" },
  { fill: "var(--color-fill-sky)", dot: "bg-fill-sky" },
  { fill: "var(--color-fill-mint)", dot: "bg-fill-mint" },
  { fill: "var(--color-fill-neutral-medium)", dot: "bg-fill-neutral-medium" },
];

function serverLabel(server: ReportTopServer) {
  return server.name ?? server.instanceId ?? "이름 없는 서버";
}

type ReportServerShareProps = {
  servers: ReportTopServer[];
  currency: Currency;
};

export function ReportServerShare({
  servers,
  currency,
}: ReportServerShareProps) {
  return (
    <section className="flex min-w-0 flex-1 flex-col gap-gap-large">
      <h2 className="text-title-xsmall text-text-strong">서버별 비중</h2>
      {servers.length === 0 ? (
        <p className="text-subtext-medium text-text-tertiary">
          단가를 아는 서버 기록이 없어 비중을 보여 드릴 수 없어요.
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-spacing-medium">
          <div className="size-40 shrink-0" aria-hidden>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={servers}
                  dataKey="estimatedCost"
                  innerRadius="62%"
                  outerRadius="100%"
                  stroke="none"
                  isAnimationActive={false}
                >
                  {servers.map((server, index) => (
                    <Cell
                      key={server.instanceId ?? "others"}
                      fill={SLICE_COLORS[index % SLICE_COLORS.length].fill}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex min-w-0 flex-1 flex-col gap-gap-medium">
            {servers.map((server, index) => (
              <li
                key={server.instanceId ?? "others"}
                className="flex items-center gap-gap-small"
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    SLICE_COLORS[index % SLICE_COLORS.length].dot,
                  )}
                />
                <span className="min-w-0 flex-1 truncate text-subtext-medium text-text-primary">
                  {serverLabel(server)}
                </span>
                <span className="text-subtext-small text-text-tertiary">
                  {formatMoney(server.estimatedCost, currency)}
                </span>
                <span className="w-12 text-right text-label-xsmall text-text-strong">
                  {server.share}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
