"use client";

import { Fragment, type ReactNode } from "react";
import type { DataSource } from "@/api/dataSource";
import { NoConnectionState } from "@/components/report/NoConnectionState";
import { Banner } from "@/components/ui/Banner";
import { useAppMode } from "@/hooks/useAppMode";
import { useDemoSetup } from "@/hooks/useDemoSetup";
import { useSelectedConnection } from "@/hooks/useSelectedConnection";

type DataSourceGateProps = {
  loading: ReactNode;
  children: (source: DataSource) => ReactNode;
};

function ConnectionGate({ loading, children }: DataSourceGateProps) {
  const { selected, isPending, error, refetch } = useSelectedConnection();

  if (isPending) return loading;
  if (error)
    return (
      <Banner
        title="연결 목록을 불러오지 못했어요"
        description={error.message}
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  if (!selected) return <NoConnectionState />;
  return (
    <Fragment key={selected.accountId}>
      {children({ kind: "aws", account: selected })}
    </Fragment>
  );
}

function DemoGate({ loading, children }: DataSourceGateProps) {
  const { setup, isPending } = useDemoSetup();
  if (isPending || !setup) return loading;
  return children({ kind: "demo", setup });
}

export function DataSourceGate(props: DataSourceGateProps) {
  const { demo } = useAppMode();
  return demo ? <DemoGate {...props} /> : <ConnectionGate {...props} />;
}
