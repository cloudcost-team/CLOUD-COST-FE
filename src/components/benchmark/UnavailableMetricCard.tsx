import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";

type UnavailableMetricCardProps = {
  title: string;
  badge?: string;
  reason: string;
  source: string;
};

export function UnavailableMetricCard({
  title,
  badge,
  reason,
  source,
}: UnavailableMetricCardProps) {
  return (
    <Panel
      as="section"
      className="flex flex-col gap-gap-small rounded-xlarge p-padding-xlarge"
    >
      <div className="flex items-center gap-gap-small">
        <h2 className="text-title-small text-text-tertiary">{title}</h2>
        {badge && <Badge>{badge}</Badge>}
      </div>
      <p className="text-subtext-medium text-text-tertiary">{reason}</p>
      <p className="text-subtext-small text-text-quaternary">{source}</p>
    </Panel>
  );
}
