"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  getDemoCosts,
  getDemoDailyCosts,
  type DemoCostSummary,
  type DemoCurrency,
  type DemoDailyCost,
  type DemoSetupRequest,
} from "@/api/demo";
import { ApiError } from "@/api/client";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ErrorReason } from "@/components/ui/ErrorReason";
import { useAppShell } from "./AppShell";

function readSetup(): DemoSetupRequest | null {
  const raw = sessionStorage.getItem("cloudcost.demoSetup");
  if (!raw) return null;
  try {
    const migrated = raw.replaceAll('"WEEKDAYS"', '"WEEKDAY_OFFICE"');
    if (migrated !== raw)
      sessionStorage.setItem("cloudcost.demoSetup", migrated);
    return JSON.parse(migrated) as DemoSetupRequest;
  } catch {
    sessionStorage.removeItem("cloudcost.demoSetup");
    return null;
  }
}

const hourlyUsd: Record<string, { LINUX: number; WINDOWS: number }> = {
  "t3.micro": { LINUX: 0.013, WINDOWS: 0.0222 },
  "t3.small": { LINUX: 0.026, WINDOWS: 0.0444 },
  "t3.medium": { LINUX: 0.052, WINDOWS: 0.0704 },
  "t3.large": { LINUX: 0.104, WINDOWS: 0.1336 },
  "m5.large": { LINUX: 0.118, WINDOWS: 0.21 },
  "m5.xlarge": { LINUX: 0.236, WINDOWS: 0.42 },
  "c5.large": { LINUX: 0.096, WINDOWS: 0.188 },
  "c5.xlarge": { LINUX: 0.192, WINDOWS: 0.376 },
  "r5.large": { LINUX: 0.152, WINDOWS: 0.244 },
  "g4dn.xlarge": { LINUX: 0.647, WINDOWS: 0.831 },
};

function createFallbackCosts(
  setup: DemoSetupRequest,
  currency: DemoCurrency,
): { summary: DemoCostSummary; daily: DemoDailyCost } {
  const exchangeRate = currency === "KRW" ? 1400 : 1;
  const round = (value: number) =>
    currency === "KRW" ? Math.round(value) : Math.round(value * 100) / 100;
  const days: DemoDailyCost["days"] = [];

  for (
    let date = new Date(`${setup.from}T00:00:00`);
    date <= new Date(`${setup.to}T00:00:00`);
    date.setDate(date.getDate() + 1)
  ) {
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const instances = setup.servers.map((server, index) => {
      const hoursPerInstance =
        server.schedule === "ALWAYS"
          ? 24
          : server.schedule === "WEEKDAY_OFFICE"
            ? weekend
              ? 0
              : 10
            : (server.hoursPerDay ?? 8);
      const usageHours = hoursPerInstance * server.count;
      const rate =
        (hourlyUsd[server.instanceType]?.[server.os] ?? 0) * exchangeRate;
      return {
        instanceId: `demo-${index}`,
        name:
          server.count > 1 ? `${server.name} × ${server.count}` : server.name,
        instanceType: server.instanceType,
        state: "running",
        usageHours,
        estimatedHourlyCost: round(rate),
        estimatedCost: round(rate * usageHours),
        note: "체험용 고정 단가로 계산한 추정치",
      };
    });
    days.push({
      date: format(date, "yyyy-MM-dd"),
      usageHours: instances.reduce((sum, row) => sum + row.usageHours, 0),
      estimatedCost: round(
        instances.reduce((sum, row) => sum + (row.estimatedCost ?? 0), 0),
      ),
      instances,
    });
  }

  const instances = setup.servers.map((server, index) => {
    const rows = days.map((day) => day.instances[index]);
    return {
      ...rows[0],
      usageHours: rows.reduce((sum, row) => sum + row.usageHours, 0),
      estimatedCost: round(
        rows.reduce((sum, row) => sum + (row.estimatedCost ?? 0), 0),
      ),
    };
  });
  const usageHours = days.reduce((sum, day) => sum + day.usageHours, 0);
  const estimatedCost = round(
    days.reduce((sum, day) => sum + day.estimatedCost, 0),
  );
  const notes = ["API 연결 전에는 체험용 고정 단가로 계산한 값을 표시합니다."];

  return {
    summary: {
      dataSource: "demo",
      currency,
      from: setup.from,
      to: setup.to,
      usageHours,
      estimatedCost,
      instances,
      notes,
    },
    daily: {
      dataSource: "demo",
      currency,
      from: setup.from,
      to: setup.to,
      usageHours,
      estimatedCost,
      days,
      notes,
    },
  };
}

function formatNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits }).format(
    value,
  );
}

function formatMoney(value: number | null, currency: DemoCurrency) {
  if (value === null) return "-";
  return currency === "KRW"
    ? `₩ ${formatNumber(value)}`
    : `$ ${formatNumber(value, 2)}`;
}

export function DemoDashboardScreen() {
  const router = useRouter();
  const { currency } = useAppShell();
  const setupResult = useQuery({
    queryKey: ["demo", "stored-setup"],
    queryFn: readSetup,
    staleTime: Infinity,
  });
  const setup = setupResult.data ?? null;

  useEffect(() => {
    if (setupResult.isSuccess && !setup) router.replace("/demo/setup");
  }, [router, setup, setupResult.isSuccess]);

  const result = useQuery({
    queryKey: ["demo", "dashboard", setup, currency],
    queryFn: async () => {
      try {
        const [summary, daily] = await Promise.all([
          getDemoCosts(setup!, currency),
          getDemoDailyCosts(setup!, currency),
        ]);
        return { summary, daily };
      } catch {
        // 체험 화면은 API 환경 설정이 없어도 사용 가능해야 한다.
        return createFallbackCosts(setup!, currency);
      }
    },
    enabled: Boolean(setup),
  });

  const maxCost = useMemo(
    () =>
      Math.max(
        ...(result.data?.daily.days.map((day) => day.estimatedCost) ?? [0]),
        1,
      ),
    [result.data],
  );

  const error =
    result.error instanceof ApiError
      ? result.error.message
      : "체험 비용을 계산하지 못했습니다.";
  const summary = result.data?.summary;
  const totalServers =
    setup?.servers.reduce((total, server) => total + server.count, 0) ?? 0;

  return (
    <>
      <div className="mb-6 rounded-xlarge bg-fill-brand-weak px-5 py-4 text-subtext-medium text-text-secondary">
        <strong className="mr-4 text-text-brand">체험 데이터</strong>
        예시 단가로 계산한 추정치예요. 실제 AWS 계정과 연결되지 않았어요.
      </div>
      <div className="mb-6">
        <h1 className="text-title-large text-text-strong">예시 비용</h1>
        <p className="mt-2 text-subtext-medium text-text-tertiary">
          {setup
            ? `${setup.from.replaceAll("-", ".")} ~ ${setup.to.replaceAll("-", ".")} · 서버 ${totalServers}대`
            : "비용을 계산하고 있어요."}
        </p>
      </div>

      {result.isError ? (
        <ErrorReason
          message={error}
          guide="서버 구성과 조회 기간을 확인한 뒤 다시 시도해 주세요."
          action={{
            label: "다시 시도",
            onClick: () => result.refetch(),
            loading: result.isFetching,
          }}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="gap-2 p-5">
              <div className="flex items-center gap-2 text-subtext-small text-text-tertiary">
                기간 추정 비용 <Badge>추정</Badge>
              </div>
              <strong className="text-title-large text-text-strong">
                {summary ? formatMoney(summary.estimatedCost, currency) : "-"}
              </strong>
              <span className="text-subtext-small text-text-tertiary">
                {setup ? `${setup.from}~${setup.to} 합산 추정치` : "계산 중"}
              </span>
            </Card>
            <Card className="gap-2 p-5">
              <span className="text-subtext-small text-text-tertiary">
                사용 시간
              </span>
              <strong className="text-title-large text-text-strong">
                {summary ? `${formatNumber(summary.usageHours, 1)}시간` : "-"}
              </strong>
              <span className="text-subtext-small text-text-tertiary">
                서버 합계
              </span>
            </Card>
            <Card className="gap-2 p-5">
              <span className="text-subtext-small text-text-tertiary">
                서버
              </span>
              <strong className="text-title-large text-text-strong">
                {totalServers}대
              </strong>
              <span className="text-subtext-small text-text-tertiary">
                Linux · Windows
              </span>
            </Card>
          </div>

          <Card title="일별 추정 비용">
            <div
              className="flex h-48 items-end gap-1 overflow-hidden pt-6"
              aria-label="일별 추정 비용 막대 차트"
            >
              {result.data?.daily.days.map((day) => (
                <div
                  key={day.date}
                  className="group relative flex min-w-1 flex-1 items-end"
                  title={`${day.date}: ${formatMoney(day.estimatedCost, currency)}`}
                >
                  <div
                    className="w-full rounded-t-small bg-fill-brand transition-opacity hover:opacity-75"
                    style={{
                      height: `${Math.max((day.estimatedCost / maxCost) * 100, 4)}%`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-subtext-small text-text-tertiary">
              <span>{result.data?.daily.from}</span>
              <span>{result.data?.daily.to}</span>
            </div>
          </Card>

          <section>
            <h2 className="mb-3 text-title-xsmall text-text-strong">
              서버별 비용
            </h2>
            <div className="overflow-x-auto rounded-xlarge border border-border-default bg-background-default">
              <table className="w-full min-w-[760px] text-left text-subtext-small">
                <thead className="bg-fill-neutral-weak text-text-tertiary">
                  <tr>
                    <th className="px-5 py-3 font-normal">이름</th>
                    <th className="px-5 py-3 font-normal">타입</th>
                    <th className="px-5 py-3 font-normal">사용 시간</th>
                    <th className="px-5 py-3 font-normal">시간당 단가</th>
                    <th className="px-5 py-3 text-right font-normal">
                      추정 비용
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {summary?.instances.map((instance) => (
                    <tr
                      key={instance.instanceId}
                      className="border-t border-border-default text-text-primary"
                    >
                      <td className="px-5 py-4">
                        {instance.name ?? "이름 없음"}
                      </td>
                      <td className="px-5 py-4">
                        {instance.instanceType ?? "-"}
                      </td>
                      <td className="px-5 py-4">
                        {formatNumber(instance.usageHours, 1)}시간
                      </td>
                      <td className="px-5 py-4">
                        {formatMoney(instance.estimatedHourlyCost, currency)}
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-text-strong">
                        {formatMoney(instance.estimatedCost, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          {summary?.notes[0] && (
            <p className="text-subtext-small text-text-tertiary">
              · {summary.notes[0]}
            </p>
          )}
        </div>
      )}
    </>
  );
}
