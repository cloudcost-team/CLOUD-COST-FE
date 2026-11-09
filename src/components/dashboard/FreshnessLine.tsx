import type { CostFreshness } from "./DashboardScreen";
import { Icon } from "@/components/ui/Icon";
import { formatKstDateTime } from "@/lib/kstDate";

type FreshnessLineProps = {
  freshness: CostFreshness;
};

export function FreshnessLine({ freshness }: FreshnessLineProps) {
  const parts = [
    freshness.usageRefreshedAt
      ? `마지막 수집 ${formatKstDateTime(freshness.usageRefreshedAt)} (KST)`
      : "아직 수집 기록이 없어요",
  ];
  if (freshness.nextUsageRefreshAt)
    parts.push(
      `다음 갱신 ${formatKstDateTime(freshness.nextUsageRefreshAt).slice(11)}`,
    );
  if (freshness.usageFromCache) parts.push("저장된 데이터를 보여 주는 중");

  return (
    <p className="flex items-center gap-gap-xsmall text-subtext-medium text-text-tertiary">
      <Icon name="clock" size={16} className="text-icon-tertiary" />
      {parts.join(" · ")}
    </p>
  );
}
