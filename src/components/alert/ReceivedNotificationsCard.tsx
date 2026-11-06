"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import {
  useRecentNotifications,
  useUnreadNotificationCount,
} from "@/hooks/useAlerts";
import { formatKstTimeOrDate } from "@/lib/kstDate";

export function ReceivedNotificationsCard() {
  const router = useRouter();
  const { data: unread } = useUnreadNotificationCount();
  const { data: recent, isError } = useRecentNotifications(1);
  const unreadCount = unread?.unreadCount ?? 0;
  const latest = recent?.items[0];

  let summary = "알림을 불러오고 있어요";
  if (isError) summary = "알림을 불러오지 못했어요";
  else if (recent)
    summary = latest
      ? `최근: ${latest.message} · ${formatKstTimeOrDate(latest.createdAt)}`
      : "아직 받은 알림이 없어요";

  return (
    <Card className="flex-row flex-wrap items-center">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-fill-brand-weak">
        <Icon name="bell" className="text-icon-brand" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-gap-xxsmall">
        <div className="flex items-center gap-gap-small">
          <h2 className="text-title-xsmall text-text-strong">받은 알림</h2>
          {unreadCount > 0 && <Badge tone="brand">안 읽음 {unreadCount}</Badge>}
        </div>
        <p className="text-subtext-medium break-words text-text-tertiary">
          {summary}
        </p>
      </div>
      <Button
        variant="secondary"
        size="medium"
        icon="arrow-right"
        onClick={() => router.push("/notifications")}
      >
        모든 알림 보기
      </Button>
    </Card>
  );
}
