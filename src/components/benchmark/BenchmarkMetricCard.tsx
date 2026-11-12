import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { InteractionOverlay } from "@/components/ui/InteractionOverlay";
import { BenchmarkStatusAnimation, type BenchmarkStatus } from "./BenchmarkStatusAnimation";

type BenchmarkMetricCardProps = {
  title: string;
  description: string;
  value: string;
  comparison: string | null;
  source: string;
  chart?: ReactNode;
  status?: BenchmarkStatus;
  onOpenDetail?: () => void;
};

export function BenchmarkMetricCard({
  title,
  description,
  value,
  comparison,
  source,
  chart,
  status,
  onOpenDetail,
}: BenchmarkMetricCardProps) {
  return (
    <Card className="relative gap-spacing-medium md:flex-row md:items-center">
      <div className="flex flex-col gap-gap-small md:w-1/3 md:shrink-0">
        <h2 className="text-title-small text-text-strong">{title}</h2>
        <p className="text-subtext-medium text-text-tertiary">{description}</p>
        <p className="text-display-medium text-text-brand">{value}</p>
        {comparison && (
          <p className="text-label-small text-text-strong">{comparison}</p>
        )}
        <p className="text-subtext-small text-text-quaternary">{source}</p>
      </div>
      {status && (
        <div className="flex shrink-0 items-center justify-center md:w-24 md:-translate-x-8 xl:-translate-x-20">
          <BenchmarkStatusAnimation status={status} />
        </div>
      )}
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
