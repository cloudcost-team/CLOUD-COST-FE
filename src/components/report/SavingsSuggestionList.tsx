import type { Currency } from "@/api/costs";
import type { DataSource } from "@/api/dataSource";
import type { ReportDetailResponse, ReportSavingsItem } from "@/api/reports";
import type { WasteItem } from "@/api/waste";
import { useWaste } from "@/hooks/useWaste";
import { formatMoney } from "@/lib/formatMoney";

const STATUS_MESSAGES = {
  NONE_FOUND: "줄일 수 있는 서버를 찾지 못했어요.",
  INSUFFICIENT_HISTORY: "기록이 14일보다 짧아 아직 판단하지 않았어요.",
};

type SavingsSuggestionListProps = {
  savings: NonNullable<ReportDetailResponse["savings"]>;
  currency: Currency;
  source: DataSource;
};

type SavingsSuggestionRowProps = {
  index: number;
  item: ReportSavingsItem;
  detail: WasteItem | undefined;
  currency: Currency;
};

function ChangeLabel({
  item,
  detail,
}: {
  item: ReportSavingsItem;
  detail: WasteItem | undefined;
}) {
  if (!detail)
    return (
      <span className="text-label-medium text-text-secondary">
        {item.action}
      </span>
    );
  const { current, recommended } = detail.comparison;
  return (
    <span className="flex items-center gap-gap-small text-label-medium-strong">
      <span className="text-text-tertiary">{current.instanceType}</span>
      <span className="text-text-quaternary">→</span>
      <span className="text-text-brand">
        {recommended?.instanceType ?? "중지·종료"}
      </span>
    </span>
  );
}

function SavingsSuggestionRow({
  index,
  item,
  detail,
  currency,
}: SavingsSuggestionRowProps) {
  return (
    <li className="flex items-start gap-gap-medium border-b border-border-weak py-padding-large last:border-b-0">
      <span className="w-6 shrink-0 text-title-small text-text-quaternary">
        {index + 1}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-gap-medium">
        <div className="flex flex-wrap items-center gap-gap-large">
          <span className="w-45 truncate text-title-small text-text-strong">
            {item.name ?? item.instanceId}
          </span>
          <span className="min-w-0 flex-1">
            <ChangeLabel item={item} detail={detail} />
          </span>
          <span className="rounded-medium bg-fill-mint-weak px-padding-small py-gap-xsmall text-label-medium-strong text-text-success">
            월 {formatMoney(item.monthlySavings, currency)} 절감
          </span>
        </div>
        {detail && (
          <ul className="flex list-disc flex-col gap-gap-xsmall pl-padding-large text-subtext-medium text-text-secondary">
            {detail.summary.map((line) => (
              <li key={line.title}>
                {line.title} · {line.detail}
              </li>
            ))}
            {detail.summaryNote && (
              <li className="text-text-tertiary">{detail.summaryNote}</li>
            )}
          </ul>
        )}
      </div>
    </li>
  );
}

export function SavingsSuggestionList({
  savings,
  currency,
  source,
}: SavingsSuggestionListProps) {
  const waste = useWaste(source);
  const details = new Map(
    waste.data?.items.map((item) => [item.recommendationId, item]),
  );

  return (
    <section className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-gap-small border-b border-border-default pb-padding-small">
        <h2 className="text-title-xsmall text-text-strong">
          다음 달 절감 제안
        </h2>
        {savings.status === "OK" && (
          <p className="text-subtext-medium text-text-secondary">
            모두 적용하면 월 {formatMoney(savings.monthlySavings, currency)}{" "}
            절감 예상
          </p>
        )}
      </div>
      {savings.status === "OK" ? (
        <ol>
          {savings.items.map((item, index) => (
            <SavingsSuggestionRow
              key={item.recommendationId}
              index={index}
              item={item}
              detail={details.get(item.recommendationId)}
              currency={currency}
            />
          ))}
        </ol>
      ) : (
        <p className="py-padding-large text-subtext-medium text-text-tertiary">
          {STATUS_MESSAGES[savings.status]}
        </p>
      )}
    </section>
  );
}
