import type { AlertChannelType, Notification } from "@/api/alerts";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { formatKstTimeOrDate } from "@/lib/kstDate";
import { NotificationTypeBadge } from "./NotificationTypeBadge";

const CHANNEL_LABELS: Record<AlertChannelType, string> = {
  DISCORD: "Discord",
};

type NotificationItemProps = {
  notification: Notification;
  onSelect: (notification: Notification) => void;
};

export function NotificationItem({
  notification,
  onSelect,
}: NotificationItemProps) {
  const { read } = notification;
  return (
    <button
      type="button"
      onClick={() => onSelect(notification)}
      className="flex min-h-18 w-full cursor-pointer items-center gap-gap-medium border-b border-border-weak bg-background-default p-padding-large text-left last:border-b-0 hover:bg-background-lower focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-brand"
    >
      <span
        aria-hidden
        className={cn(
          "size-2 shrink-0 rounded-full",
          read ? "bg-transparent" : "bg-fill-brand",
        )}
      />
      <NotificationTypeBadge
        notification={notification}
        className={cn(read && "opacity-50")}
      />
      <span
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-gap-xxsmall",
          read && "opacity-50",
        )}
      >
        <span
          className={cn(
            "break-words text-text-strong",
            read ? "text-subtext-large" : "text-label-small",
          )}
        >
          {!read && <span className="sr-only">안 읽음: </span>}
          {notification.message}
        </span>
        <span className="text-subtext-small text-text-tertiary">
          {notification.accountName}
          {notification.deliveries.map((delivery) => (
            <span
              key={delivery.channelId}
              className={cn(delivery.status === "FAILED" && "text-text-danger")}
            >
              {` · ${CHANNEL_LABELS[delivery.channelType]} ${delivery.statusLabel}`}
            </span>
          ))}
        </span>
      </span>
      <span
        className={cn(
          "shrink-0 text-subtext-small text-text-quaternary",
          read && "opacity-50",
        )}
      >
        {formatKstTimeOrDate(notification.createdAt)}
      </span>
      <Icon name="chevron-right" size={16} className="text-icon-secondary" />
    </button>
  );
}
