import type { Currency } from "@/api/costs";
import type { ReportDetailResponse } from "@/api/reports";
import { formatMoney } from "@/lib/formatMoney";

const STATUS_MESSAGES = {
  NONE_FOUND: "줄일 수 있는 서버를 찾지 못했어요.",
  INSUFFICIENT_HISTORY: "기록이 14일보다 짧아 아직 판단하지 않았어요.",
};

type SavingsSuggestionListProps = {
  savings: NonNullable<ReportDetailResponse["savings"]>;
  currency: Currency;
};

export function SavingsSuggestionList({
  savings,
  currency,
}: SavingsSuggestionListProps) {
  return (
    <section className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-gap-small border-b border-border-default pb-padding-small">
        <h2 className="text-title-xsmall text-text-strong">
          다음 달 절감 제안
        </h2>
        {savings.status === "OK" && (
          <p className="text-subtext-medium text-text-secondary">
            모두 적용하면 월 {formatMoney(savings.monthlySavings, currency)}{" "}
            절감 (추정)
          </p>
        )}
      </div>
      {savings.status === "OK" ? (
        <ul>
          {savings.items.map((item) => (
            <li
              key={item.recommendationId}
              className="flex flex-wrap items-center gap-gap-medium border-b border-border-weak py-padding-large last:border-b-0"
            >
              <span className="w-45 truncate text-label-small text-text-strong">
                {item.name ?? item.instanceId}
              </span>
              <span className="min-w-0 flex-1 text-subtext-medium text-text-secondary">
                {item.action}
              </span>
              <span className="text-label-small text-text-strong">
                월 {formatMoney(item.monthlySavings, currency)} 절감
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-padding-large text-subtext-medium text-text-tertiary">
          {STATUS_MESSAGES[savings.status]}
        </p>
      )}
    </section>
  );
}
