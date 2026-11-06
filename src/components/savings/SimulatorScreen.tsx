"use client";

import { useState } from "react";
import type { SimulationResponse } from "@/api/simulations";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Slider } from "@/components/ui/Slider";
import { ChangeSelectItem } from "./ChangeSelectItem";
import { SimulationResultCard } from "./SimulationResultCard";

type SimulatorScreenProps = {
  data: SimulationResponse;
  initialRecommendationId?: string;
};

export function SimulatorScreen({
  data,
  initialRecommendationId,
}: SimulatorScreenProps) {
  const initialIds =
    initialRecommendationId &&
    data.selected.some(
      (item) => item.recommendationId === initialRecommendationId,
    )
      ? [initialRecommendationId]
      : data.selected.map((item) => item.recommendationId);
  const [selectedIds, setSelectedIds] = useState(initialIds);
  const [growth, setGrowth] = useState(data.trafficGrowthPercent);
  function changeItem(id: string, checked: boolean) {
    setSelectedIds((current) =>
      checked
        ? [...current, id]
        : current.filter((selected) => selected !== id),
    );
  }
  return (
    <div className="flex flex-col gap-spacing-medium">
      <PageHeader
        title="비용 시뮬레이터"
        description="추천을 골라 적용하면 비용이 얼마나 바뀌는지 미리 봐요. 실제 변경은 AWS 콘솔에서 해 주세요."
      />
      <div className="grid items-start gap-gap-xlarge xl:grid-cols-[minmax(0,1fr)_23.75rem]">
        <div className="flex flex-col gap-gap-xlarge">
          <Card
            title="적용할 변경"
            action={
              <span className="text-subtext-medium text-text-tertiary">
                {selectedIds.length} / {data.selected.length}
              </span>
            }
          >
            <div>
              {data.selected.map((item) => (
                <ChangeSelectItem
                  key={item.recommendationId}
                  item={item}
                  currency={data.currency}
                  checked={selectedIds.includes(item.recommendationId)}
                  onCheckedChange={(checked) =>
                    changeItem(item.recommendationId, checked)
                  }
                />
              ))}
            </div>
          </Card>
          <Card
            title="예상 사용량 증가"
            action={
              <span className="text-title-small text-text-brand">
                {growth}%
              </span>
            }
          >
            <Slider
              value={growth}
              min={0}
              max={100}
              step={1}
              onValueChange={setGrowth}
              minLabel="0%"
              markerLabel="+50%"
              maxLabel="+100%"
              aria-label="예상 사용량 증가"
            />
            <p className="text-subtext-medium text-text-tertiary">
              서버·DB·트래픽 사용량이 지금보다 이만큼 늘어난다고 보고, 늘어난
              만큼 비용을 다시 계산해요.
            </p>
          </Card>
        </div>
        <SimulationResultCard
          data={{
            ...data,
            selectedCount: selectedIds.length,
            trafficGrowthPercent: growth,
          }}
        />
      </div>
    </div>
  );
}
