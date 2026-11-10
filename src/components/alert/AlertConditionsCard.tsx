"use client";

import type { AlertConditions, AlertSettings } from "@/api/alerts";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { NoticeList } from "@/components/ui/NoticeList";
import { Switch } from "@/components/ui/Switch";
import { useUpdateAlertConditions } from "@/hooks/useAlerts";

const CONDITIONS: {
  key: keyof AlertConditions;
  label: string;
  description?: string;
}[] = [
  {
    key: "budget80",
    label: "예산 80% 도달",
    description: "월말 예상 비용 기준",
  },
  { key: "budget100", label: "예산 100% 도달" },
  { key: "budget120", label: "예산 120% 도달" },
  {
    key: "spike",
    label: "비용 급증",
    description: "평소(중앙값)의 1.5배 이상인 날",
  },
  {
    key: "weeklySummary",
    label: "주간 요약",
    description: "매주 월요일 오전, 지난주 추정 비용 요약",
  },
];

const NOTES = [
  "서비스에 접속하지 않은 동안에는 새 알림이 생기지 않아요.",
];

function pickConditions(settings: AlertSettings): AlertConditions {
  const { budget80, budget100, budget120, spike, weeklySummary } = settings;
  return { budget80, budget100, budget120, spike, weeklySummary };
}

export function AlertConditionsCard({ settings }: { settings: AlertSettings }) {
  const update = useUpdateAlertConditions();

  function toggle(key: keyof AlertConditions, checked: boolean) {
    update.mutate({ ...pickConditions(settings), [key]: checked });
  }

  return (
    <Card className="gap-gap-xlarge">
      <div className="flex flex-col gap-gap-xsmall">
        <h2 className="text-title-small text-text-strong">알림 조건</h2>
        <p className="text-subtext-medium text-text-tertiary">
          켜고 끄면 바로 저장돼요.
        </p>
      </div>
      {CONDITIONS.map((condition) => (
        <div
          key={condition.key}
          className="flex items-center justify-between gap-gap-large"
        >
          <div className="flex min-w-0 flex-col gap-gap-xxsmall">
            <p
              id={`alert-${condition.key}`}
              className="text-label-small text-text-strong"
            >
              {condition.label}
            </p>
            {condition.description && (
              <p className="text-subtext-medium text-text-tertiary">
                {condition.description}
              </p>
            )}
          </div>
          <Switch
            aria-labelledby={`alert-${condition.key}`}
            checked={settings[condition.key]}
            onCheckedChange={(checked) => toggle(condition.key, checked)}
            disabled={update.isPending}
          />
        </div>
      ))}
      {update.isError && (
        <Banner title="저장하지 못했어요" description={update.error.message} />
      )}
      <NoticeList
        lines={NOTES}
        className="gap-gap-xxsmall text-subtext-small"
      />
    </Card>
  );
}
