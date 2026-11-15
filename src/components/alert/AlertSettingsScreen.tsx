"use client";

import { DataSourceGate } from "@/components/layout/DataSourceGate";
import { Banner } from "@/components/ui/Banner";
import { Panel } from "@/components/ui/Panel";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAlertSettings } from "@/hooks/useAlerts";
import { useAppMode } from "@/hooks/useAppMode";
import { AlertChannelCard } from "./AlertChannelCard";
import { AlertConditionsCard } from "./AlertConditionsCard";
import { BudgetCard } from "./BudgetCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReceivedNotificationsCard } from "./ReceivedNotificationsCard";

function AlertSettingsBody() {
  const { data, isPending, isError, error, refetch } = useAlertSettings();

  if (isPending)
    return (
      <>
        <Skeleton shape="block" className="h-64 w-full" />
        <Skeleton shape="block" className="h-80 w-full" />
      </>
    );
  if (isError)
    return (
      <Banner
        title="알림 설정을 불러오지 못했어요"
        description={error.message}
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  return (
    <>
      <BudgetCard connections={data.budgets} />
      <AlertConditionsCard settings={data} />
    </>
  );
}

function DemoAlertSettingsBody() {
  return (
    <>
      <DataSourceGate
        loading={<Skeleton shape="block" className="h-64 w-full" />}
      >
        {(source) =>
          source.kind === "demo" && <BudgetCard demoTarget={source} />
        }
      </DataSourceGate>
      <Panel
        as="p"
        size="medium"
        className="text-subtext-medium text-text-secondary"
      >
        알림 조건과 디스코드 채널은 내 AWS를 연결하면 쓸 수 있어요.
      </Panel>
    </>
  );
}

export function AlertSettingsScreen() {
  const { demo } = useAppMode();
  return (
    <div className="flex flex-col gap-spacing-medium">
      <PageHeader
        title="알림 설정"
        description="예산을 넘거나 비용이 급증하면 알려 드려요."
      />
      {demo ? (
        <DemoAlertSettingsBody />
      ) : (
        <>
          <ReceivedNotificationsCard />
          <AlertSettingsBody />
          <AlertChannelCard />
        </>
      )}
    </div>
  );
}
