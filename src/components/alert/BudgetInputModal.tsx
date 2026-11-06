"use client";

import { useState, type FormEvent } from "react";
import type { BudgetCurrency } from "@/api/budget";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { BudgetUsage } from "./BudgetUsage";

const numberFormat = new Intl.NumberFormat("ko-KR");

type BudgetInputModalProps = {
  open: boolean;
  onClose: () => void;
  connectionName: string;
  currency: BudgetCurrency;
  initialAmount: number;
  forecastMonthEndCost: number | null;
  saving: boolean;
  error?: string;
  onSave: (amount: number) => void;
};

export function BudgetInputModal({
  open,
  onClose,
  connectionName,
  currency,
  initialAmount,
  forecastMonthEndCost,
  saving,
  error,
  onSave,
}: BudgetInputModalProps) {
  const [digits, setDigits] = useState(String(initialAmount));
  const [emptyError, setEmptyError] = useState<string>();
  const amount = Number(digits);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!digits || amount <= 0) {
      setEmptyError("0보다 큰 금액을 입력해 주세요.");
      return;
    }
    setEmptyError(undefined);
    onSave(amount);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="월 예산 직접 입력"
      description={connectionName}
      className="w-110"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-gap-large px-padding-xlarge pt-padding-small pb-padding-xlarge"
      >
        <Input
          label={`월 예산 (${currency === "KRW" ? "원" : "달러"})`}
          prefix={currency === "KRW" ? "₩" : "$"}
          inputMode="numeric"
          autoComplete="off"
          value={digits ? numberFormat.format(amount) : ""}
          onChange={(event) =>
            setDigits(event.currentTarget.value.replace(/\D/g, ""))
          }
          helperText="슬라이더 범위 밖 금액도 넣을 수 있어요."
          error={emptyError ?? error}
          data-autofocus
        />
        <BudgetUsage
          forecastMonthEndCost={forecastMonthEndCost}
          currency={currency}
        />
        <div className="flex justify-end gap-gap-small">
          <Button variant="assistive" size="medium" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" size="medium" loading={saving}>
            저장
          </Button>
        </div>
      </form>
    </Modal>
  );
}
