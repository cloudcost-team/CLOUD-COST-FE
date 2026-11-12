"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Notification } from "@/api/alerts";
import { Icon } from "@/components/ui/Icon";
import { InteractionOverlay } from "@/components/ui/InteractionOverlay";
import { TextButton } from "@/components/ui/TextButton";
import { TextLink } from "@/components/ui/TextLink";
import { useDismiss } from "@/hooks/useDismiss";
import {
  useReadAllNotifications,
  useReadNotification,
  useRecentNotifications,
  useUnreadNotificationCount,
} from "@/hooks/useAlerts";
import { cn } from "@/lib/cn";
import { formatKstRelative } from "@/lib/kstDate";
import { NotificationTypeBadge } from "@/components/notification/NotificationTypeBadge";

const PREVIEW_LIMIT = 3;

function NotificationPanelBody({
  onSelect,
}: {
  onSelect: (notification: Notification) => void;
}) {
  const { data, isPending, isError } = useRecentNotifications(PREVIEW_LIMIT);

  if (isPending)
    return (
      <p className="p-padding-medium text-subtext-medium text-text-tertiary">
        알림을 불러오고 있어요
      </p>
    );
  if (isError)
    return (
      <p className="p-padding-medium text-subtext-medium text-text-danger">
        알림을 불러오지 못했어요
      </p>
    );
  if (data.items.length === 0)
    return (
      <p className="p-padding-medium text-subtext-medium text-text-tertiary">
        아직 받은 알림이 없어요
      </p>
    );
  return (
    <ul>
      {data.items.map((notification) => (
        <li key={notification.id} className="border-b border-border-weak">
          <button
            type="button"
            onClick={() => onSelect(notification)}
            className={cn(
              "flex w-full cursor-pointer flex-col gap-gap-small p-padding-medium text-left hover:bg-background-lower focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-brand",
              notification.read && "opacity-50",
            )}
          >
            <span className="flex w-full items-center justify-between gap-gap-small">
              <NotificationTypeBadge notification={notification} />
              <span className="text-subtext-small text-text-quaternary">
                {formatKstRelative(notification.createdAt)}
              </span>
            </span>
            <span
              className={cn(
                "text-subtext-medium break-words text-text-primary",
                !notification.read && "text-subtext-medium-strong",
              )}
            >
              {notification.message}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function NotificationBell() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const { data: unread } = useUnreadNotificationCount();
  const readNotification = useReadNotification();
  const readAll = useReadAllNotifications();
  const unreadCount = unread?.unreadCount ?? 0;

  useDismiss(rootRef, open, (reason) => {
    setOpen(false);
    if (reason === "escape") triggerRef.current?.focus();
  });

  function selectNotification(notification: Notification) {
    if (!notification.read) readNotification.mutate(notification.id);
    setOpen(false);
    router.push("/notifications");
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={
          unreadCount > 0 ? `알림, 안 읽은 알림 ${unreadCount}개` : "알림"
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className="group relative flex size-9 cursor-pointer items-center justify-center rounded-medium focus-visible:outline-2 focus-visible:outline-border-brand"
      >
        <InteractionOverlay tone="neutral" />
        <Icon name="bell" className="relative text-icon-default" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 left-5 flex h-4 min-w-4 items-center justify-center rounded-full bg-fill-danger px-1 text-subtext-small text-text-on-fill">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="알림"
          className="absolute top-full right-0 z-50 mt-2 w-90 overflow-hidden rounded-xlarge border border-border-weak bg-background-floated shadow-default"
        >
          <div className="flex items-center justify-between border-b border-border-weak p-padding-medium">
            <p className="text-label-small text-text-strong">알림</p>
            <TextButton
              onClick={() => readAll.mutate()}
              disabled={unreadCount === 0 || readAll.isPending}
            >
              모두 읽음
            </TextButton>
          </div>
          <NotificationPanelBody onSelect={selectNotification} />
          <div className="flex items-center justify-between p-padding-medium">
            <TextLink
              href="/notifications"
              icon="arrow-right"
              onClick={() => setOpen(false)}
            >
              모든 알림 보기
            </TextLink>
            <TextLink
              href="/settings/alerts"
              tone="neutral"
              icon={null}
              onClick={() => setOpen(false)}
            >
              알림 설정
            </TextLink>
          </div>
        </div>
      )}
    </div>
  );
}
