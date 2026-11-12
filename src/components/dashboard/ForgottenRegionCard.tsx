"use client";

import type { DataSource } from "@/api/dataSource";
import { PermissionUpgradeNotice } from "@/components/connection/PermissionUpgradeNotice";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { useAppMode, useAppPath } from "@/hooks/useAppMode";
import { useWaste } from "@/hooks/useWaste";

export function ForgottenRegionCard({ source }: { source: DataSource }) {
  const { demo } = useAppMode();
  const appPath = useAppPath();
  const resources = useWaste(source).data?.resources;

  if (!resources) return null;
  if (resources.scan.status === "PERMISSION_UPGRADE_REQUIRED")
    return (
      <PermissionUpgradeNotice
        scan={resources.scan}
        upgrade={resources.upgrade}
      />
    );
  if (resources.otherRegions.length === 0) return null;

  return (
    <section className="flex flex-wrap items-center justify-between gap-gap-large rounded-xlarge border border-border-default bg-fill-warning-weak p-padding-large">
      <div className="flex min-w-0 flex-col gap-gap-xsmall">
        <div className="flex items-center gap-gap-xsmall">
          <Icon name="alert-triangle" className="text-icon-warning" />
          <h2 className="text-label-small text-text-strong">
            기본 리전 밖에서 실행 중인 서버가 있어요
          </h2>
        </div>
        <ul className="flex flex-wrap gap-x-gap-large gap-y-gap-xxsmall text-title-xsmall text-text-strong">
          {resources.otherRegions.map((region) => (
            <li key={region.region}>
              {region.region} · 서버 {region.runningServers}대
            </li>
          ))}
        </ul>
        <p className="text-subtext-medium text-text-secondary">
          {`연결한 기본 리전(${resources.homeRegion}) 밖이라 잊고 켜 둔 서버일 수 있어요.`}
        </p>
      </div>
      {!demo && (
        <ButtonLink
          variant="secondary"
          size="medium"
          icon="arrow-right"
          href={appPath("/savings/waste")}
        >
          방치 리소스 보기
        </ButtonLink>
      )}
    </section>
  );
}
