import type { SimulationResponse } from "@/api/simulations";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Panel } from "@/components/ui/Panel";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatMoney } from "@/lib/formatMoney";

type SimulationResultCardProps = { data: SimulationResponse };

function CostRow({
  label,
  amount,
  max,
  value,
  strong = false,
}: {
  label: string;
  amount: string;
  max: number;
  value: number;
  strong?: boolean;
}) {
  return (
    <div className="grid grid-cols-[3rem_1fr_auto] items-center gap-gap-medium">
      <span
        className={
          strong
            ? "text-label-small text-text-strong"
            : "text-subtext-medium text-text-tertiary"
        }
      >
        {label}
      </span>
      <ProgressBar
        value={value}
        max={max}
        aria-label={`${label} 월 예상 비용`}
        tone={strong ? "brand" : "neutral"}
      />
      <span
        className={
          strong
            ? "text-label-small text-text-strong"
            : "text-subtext-medium text-text-secondary"
        }
      >
        {amount}
      </span>
    </div>
  );
}

export function SimulationResultCard({ data }: SimulationResultCardProps) {
  const before = data.before?.monthlyCost ?? 0;
  const after = data.after?.monthlyCost ?? 0;
  const max = Math.max(before, after, 1);
  return (
    <Card title="시뮬레이션 결과" action={<Badge>추정</Badge>}>
      <Panel variant="brand">
        <p className="text-subtext-medium text-text-tertiary">
          고른 {data.selectedCount}건을 적용하면
        </p>
        <p className="mt-gap-xsmall text-title-medium text-text-brand">
          매달{" "}
          {data.monthlySavings === null
            ? "—"
            : formatMoney(data.monthlySavings, data.currency)}{" "}
          절감
        </p>
        <p className="mt-gap-xxsmall text-subtext-medium text-text-tertiary">
          1년이면{" "}
          {data.yearlySavings === null
            ? "—"
            : formatMoney(data.yearlySavings, data.currency)}{" "}
          절감해요
        </p>
      </Panel>
      <div className="flex flex-col gap-gap-medium">
        <div className="flex items-center justify-between">
          <h3 className="text-label-small text-text-strong">월 예상 비용</h3>
          <span className="text-subtext-small text-text-quaternary">
            사용량 +{data.trafficGrowthPercent}% 가정
          </span>
        </div>
        <CostRow
          label="지금"
          amount={
            data.before?.monthlyCost === null || !data.before
              ? "—"
              : formatMoney(data.before.monthlyCost, data.currency)
          }
          max={max}
          value={before}
        />
        <CostRow
          label="변경 후"
          amount={
            data.after?.monthlyCost === null || !data.after
              ? "—"
              : formatMoney(data.after.monthlyCost, data.currency)
          }
          max={max}
          value={after}
          strong
        />
      </div>
      {data.budget ? (
        <div className="flex items-center border-t border-border-weak pt-padding-large text-subtext-medium text-text-tertiary">
          <span>
            예산 {formatMoney(data.budget.amount, data.currency)} 대비
          </span>
          <span className="ml-auto">
            {data.before?.budgetRate ?? "—"}%{" "}
            <span className="mx-gap-small">→</span>{" "}
            <strong className="text-label-small text-text-brand">
              {data.after?.budgetRate ?? "—"}%
            </strong>
          </span>
        </div>
      ) : (
        <Panel variant="dashed" size="medium">
          <p className="text-subtext-medium text-text-tertiary">
            월 예산을 정하면 예산 안에 드는지도 보여 드려요
          </p>
          <Button variant="assistive" size="small" className="mt-gap-small">
            예산 설정하기
          </Button>
        </Panel>
      )}
    </Card>
  );
}
