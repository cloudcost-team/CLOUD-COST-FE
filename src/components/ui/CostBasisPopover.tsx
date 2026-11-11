"use client";

import { useState } from "react";
import { Popover } from "./Popover";
import { TextButton } from "./TextButton";

type CostBasisPopoverProps = {
  exchangeRateDate?: string | null;
  align?: "start" | "end";
};

export function CostBasisPopover({
  exchangeRateDate,
  align = "end",
}: CostBasisPopoverProps) {
  const [open, setOpen] = useState(false);
  const rows = [
    {
      label: "계산 방법",
      value: "사용 시간 × AWS 온디맨드 시간당 단가 (한 달은 730시간)",
    },
    {
      label: "빠진 비용",
      value: "RI·Savings Plans·Spot 할인, EBS 볼륨, 데이터 전송",
    },
    {
      label: "단가 없음",
      value: "단가를 못 찾은 서버는 0원이 아니라 이유를 보여 드려요",
    },
  ];
  if (exchangeRateDate)
    rows.push({
      label: "환율",
      value: `${exchangeRateDate} 환율로 원화로 바꿨어요`,
    });

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      title="숫자는 이렇게 계산해요"
      align={align}
      helper="청구서 금액이 아니라 추정치라서 실제 청구액과 다를 수 있어요."
      trigger={(props) => (
        <TextButton
          {...props}
          icon="info"
          className="flex text-subtext-small text-text-tertiary"
        >
          숫자 출처
        </TextButton>
      )}
    >
      <dl className="flex flex-col gap-gap-small">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-gap-medium">
            <dt className="w-16 shrink-0 text-subtext-small text-text-quaternary">
              {row.label}
            </dt>
            <dd className="text-subtext-medium text-text-secondary">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </Popover>
  );
}
