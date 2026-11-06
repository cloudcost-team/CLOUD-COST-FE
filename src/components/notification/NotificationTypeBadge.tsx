import type { Notification, NotificationType } from "@/api/alerts";
import { Badge, type BadgeTone } from "@/components/ui/Badge";

const TYPE_TONES: Record<NotificationType, BadgeTone> = {
  BUDGET: "warning",
  SPIKE: "danger",
  WEEKLY_SUMMARY: "neutral",
};

export function getNotificationHref(type: NotificationType) {
  return type === "BUDGET" ? "/settings/alerts" : "/dashboard";
}

export function NotificationTypeBadge({
  notification,
  className,
}: {
  notification: Pick<Notification, "type" | "typeLabel">;
  className?: string;
}) {
  return (
    <Badge tone={TYPE_TONES[notification.type]} className={className}>
      {notification.typeLabel}
    </Badge>
  );
}
