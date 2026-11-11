"use client";

import { useState } from "react";
import type { AlertSettings } from "@/api/alerts";
import type { BudgetResponse } from "@/api/budget";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Panel } from "@/components/ui/Panel";
import { Skeleton } from "@/components/ui/Skeleton";
import { Slider } from "@/components/ui/Slider";
import { TextButton } from "@/components/ui/TextButton";
import { useBudget, useSaveBudget } from "@/hooks/useAlerts";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/formatMoney";
import { useCurrencyStore } from "@/stores/currencyStore";
import { BudgetInputModal } from "./BudgetInputModal";
import { BudgetUsage } from "./BudgetUsage";

type Connection = AlertSettings["budgets"][number];

function BudgetEditor({
  connection,
  data,
  onDone,
}: {
  connection: Connection;
  data: BudgetResponse;
  onDone: () => void;
}) {
  const currency = data.currency;
  const { budget, slider, recentAverage, forecastMonthEndCost } = data;
  const [draft, setDraft] = useState(budget?.amount ?? slider.suggested);
  const [inputOpen, setInputOpen] = useState(false);
  const save = useSaveBudget();

  function saveAmount(amount: number) {
    save.mutate(
      { accountId: connection.accountId, amount, currency },
      { onSuccess: onDone },
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-baseline gap-gap-medium">
        <p className="text-display-medium text-text-brand">
          {formatMoney(draft, currency)}
        </p>
        {budget?.amount != null && (
          <p className="text-subtext-medium text-text-quaternary">
            지금 {formatMoney(budget.amount, currency)}
          </p>
        )}
        <TextButton tone="brand" onClick={() => setInputOpen(true)}>
          직접 입력
        </TextButton>
      </div>
      <p className="text-subtext-small text-text-tertiary">
        슬라이더를 움직여 정하고 [저장]을 눌러야 반영돼요. 정확한 금액은 [직접
        입력]으로 넣을 수 있어요.
      </p>
      <Slider
        aria-label="월 예산"
        value={Math.min(Math.max(draft, slider.min), slider.max)}
        min={slider.min}
        max={slider.max}
        step={slider.step}
        onValueChange={setDraft}
        minLabel={formatMoney(slider.min, currency)}
        markerLabel={
          recentAverage &&
          `지난 3개월 평균 ${formatMoney(recentAverage.monthlyCost, currency)}`
        }
        maxLabel={formatMoney(slider.max, currency)}
      />
      <BudgetUsage
        forecastMonthEndCost={forecastMonthEndCost}
        currency={currency}
      />
      {save.isError && !inputOpen && (
        <p role="alert" className="text-subtext-medium text-text-danger">
          {save.error.message}
        </p>
      )}
      <div className="flex justify-end gap-gap-small">
        <Button variant="assistive" size="medium" onClick={onDone}>
          취소
        </Button>
        <Button
          size="medium"
          loading={save.isPending && !inputOpen}
          onClick={() => saveAmount(draft)}
        >
          저장
        </Button>
      </div>
      {inputOpen && (
        <BudgetInputModal
          open
          onClose={() => setInputOpen(false)}
          connectionName={connection.name}
          currency={currency}
          initialAmount={draft}
          forecastMonthEndCost={forecastMonthEndCost}
          saving={save.isPending}
          error={save.error?.message}
          onSave={(amount) => {
            setDraft(amount);
            saveAmount(amount);
          }}
        />
      )}
    </>
  );
}

function BudgetView({ data }: { data: BudgetResponse }) {
  const { budget, forecastMonthEndCost, currency } = data;
  return (
    <>
      {budget ? (
        <p className="text-display-medium text-text-strong">
          {budget.amount === null ? "—" : formatMoney(budget.amount, currency)}
        </p>
      ) : (
        <p className="text-title-small text-text-tertiary">
          아직 예산을 정하지 않았어요
        </p>
      )}
      <BudgetUsage
        forecastMonthEndCost={forecastMonthEndCost}
        currency={currency}
        usageRate={budget?.usageRate}
      />
    </>
  );
}

function BudgetBody({
  connection,
  editing,
  onDone,
}: {
  connection: Connection;
  editing: boolean;
  onDone: () => void;
}) {
  const currency = useCurrencyStore((state) => state.currency);
  const { data, isPending, isError, error } = useBudget(
    connection.accountId,
    currency,
  );
  if (isPending) return <Skeleton shape="block" className="h-30 w-full" />;
  if (isError)
    return (
      <Panel
        as="p"
        size="medium"
        className="text-subtext-medium text-text-secondary"
      >
        {error.message}
      </Panel>
    );
  return editing ? (
    <BudgetEditor
      key={`${connection.accountId}-${currency}`}
      connection={connection}
      data={data}
      onDone={onDone}
    />
  ) : (
    <BudgetView data={data} />
  );
}

export function BudgetCard({ connections }: { connections: Connection[] }) {
  const [selectedId, setSelectedId] = useState(connections[0]?.accountId);
  const [editing, setEditing] = useState(false);
  const connection =
    connections.find((item) => item.accountId === selectedId) ?? connections[0];

  return (
    <Card
      title="월 예산"
      className={cn(editing && "border-2 border-border-brand")}
      action={
        connection && (
          <>
            <Select
              value={connection.accountId}
              onValueChange={(value) => {
                setSelectedId(value);
                setEditing(false);
              }}
            >
              <SelectTrigger
                aria-label="예산을 정할 연결"
                className="h-9 w-45 text-subtext-large text-text-strong [&>span]:truncate"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {connections.map((item) => (
                  <SelectItem key={item.accountId} value={item.accountId}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!editing && (
              <Button
                variant="secondary"
                size="small"
                className="h-9"
                onClick={() => setEditing(true)}
              >
                수정
              </Button>
            )}
          </>
        )
      }
    >
      {connection ? (
        <>
          <p className="text-subtext-medium text-text-tertiary">
            연결마다 따로 정해요. 대시보드의 예산 대비 비율과 시뮬레이터에도
            쓰여요.
          </p>
          <BudgetBody
            connection={connection}
            editing={editing}
            onDone={() => setEditing(false)}
          />
        </>
      ) : (
        <p className="text-subtext-medium text-text-tertiary">
          AWS 계정을 연결하면 예산을 정할 수 있어요.
        </p>
      )}
    </Card>
  );
}
