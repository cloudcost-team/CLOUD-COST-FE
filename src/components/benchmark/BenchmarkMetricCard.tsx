import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { InteractionOverlay } from "@/components/ui/InteractionOverlay";

type BenchmarkMetricCardProps = {
  title: string;
  description: string;
  value: string;
  comparison: string | null;
  source: string;
  chart?: ReactNode;
  onOpenDetail?: () => void;
};

export function BenchmarkMetricCard({
  title,
  description,
  value,
  comparison,
  source,
  chart,
  onOpenDetail,
}: BenchmarkMetricCardProps) {
  return (
    <Card className="relative gap-spacing-large md:flex-row md:items-center">
      <div className="flex flex-col gap-gap-small md:w-95 md:shrink-0">
        <h2 className="text-title-small text-text-strong">{title}</h2>
        <p className="text-subtext-medium text-text-tertiary">{description}</p>
        <p className="text-display-medium text-text-brand">{value}</p>
        {comparison && (
          <p className="text-label-small text-text-strong">{comparison}</p>
        )}
        <p className="text-subtext-small text-text-quaternary">{source}</p>
      </div>
      {chart && <div className="min-w-0 flex-1">{chart}</div>}
      {onOpenDetail && (
        <button
          type="button"
          aria-label={`${title} 자세히 보기`}
          onClick={onOpenDetail}
          className="group absolute inset-0 cursor-pointer rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand"
        >
          <InteractionOverlay tone="neutral" />
        </button>
      )}
    </Card>
  );
}
