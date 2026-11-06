"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Notification, NotificationType } from "@/api/alerts";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { IconButton } from "@/components/ui/IconButton";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  useNotificationPages,
  useReadAllNotifications,
  useReadNotification,
} from "@/hooks/useAlerts";
import { kstDaysAgo } from "@/lib/kstDate";
import { NotificationItem } from "./NotificationItem";
import { getNotificationHref } from "./NotificationTypeBadge";

type Filter = "ALL" | NotificationType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "BUDGET", label: "예산" },
  { value: "SPIKE", label: "급증" },
  { value: "WEEKLY_SUMMARY", label: "주간 요약" },
];

const GROUPS = [
  { label: "오늘", matches: (days: number) => days === 0 },
  { label: "이번 주", matches: (days: number) => days >= 1 && days < 7 },
  { label: "지난 알림", matches: (days: number) => days >= 7 },
];

function NotificationGroups({
  notifications,
  onSelect,
}: {
  notifications: Notification[];
  onSelect: (notification: Notification) => void;
}) {
  return GROUPS.map((group) => {
    const items = notifications.filter((item) =>
      group.matches(kstDaysAgo(item.createdAt)),
    );
    if (items.length === 0) return null;
    return (
      <section key={group.label} className="flex flex-col gap-gap-small">
        <h2 className="text-subtext-medium-strong text-text-tertiary">
          {group.label}
        </h2>
        <div className="overflow-hidden rounded-xlarge border border-border-default bg-background-floated">
          {items.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onSelect={onSelect}
            />
          ))}
        </div>
      </section>
    );
  });
}

function NotificationListBody({ filter }: { filter: Filter }) {
  const router = useRouter();
  const pages = useNotificationPages();
  const readNotification = useReadNotification();

  if (pages.isPending)
    return <Skeleton shape="block" className="h-72 w-full" />;
  if (pages.isError)
    return (
      <Banner
        title="알림을 불러오지 못했어요"
        description={pages.error.message}
        action={{ label: "다시 시도", onClick: () => pages.refetch() }}
      />
    );

  const notifications = pages.data.pages
    .flatMap((page) => page.items)
    .filter((item) => filter === "ALL" || item.type === filter);

  function select(notification: Notification) {
    if (!notification.read) readNotification.mutate(notification.id);
    router.push(getNotificationHref(notification.type));
  }

  return (
    <>
      {notifications.length === 0 ? (
        <EmptyState
          icon="bell"
          title="아직 받은 알림이 없어요"
          description="예산이나 비용 급증 알림을 켜 두면 여기에 모여요."
          className="rounded-xlarge bg-background-lower"
        />
      ) : (
        <NotificationGroups notifications={notifications} onSelect={select} />
      )}
      {pages.hasNextPage && (
        <Button
          variant="assistive"
          size="medium"
          className="self-center"
          loading={pages.isFetchingNextPage}
          onClick={() => pages.fetchNextPage()}
        >
          더 보기
        </Button>
      )}
    </>
  );
}

export function NotificationListScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("ALL");
  const readAll = useReadAllNotifications();

  return (
    <div className="flex flex-col gap-spacing-medium">
      <div className="flex flex-wrap items-start gap-gap-small">
        <div className="flex min-w-0 flex-1 flex-col gap-gap-small">
          <div className="flex items-center gap-gap-xsmall">
            <IconButton
              icon="chevron-left"
              size="medium"
              aria-label="뒤로 가기"
              onClick={() => router.back()}
            />
            <h1 className="text-display-small text-text-strong">알림</h1>
          </div>
          <p className="text-subtext-large text-text-tertiary">
            받은 알림을 모아 봐요. 받는 조건은 알림 설정에서 바꿀 수 있어요.
          </p>
        </div>
        <Button
          variant="secondary"
          size="medium"
          loading={readAll.isPending}
          onClick={() => readAll.mutate()}
        >
          모두 읽음
        </Button>
        <Button
          variant="assistive"
          size="medium"
          onClick={() => router.push("/settings/alerts")}
        >
          알림 설정
        </Button>
      </div>
      <FilterChips
        aria-label="알림 종류"
        options={FILTERS}
        value={filter}
        onChange={setFilter}
      />
      {readAll.isError && (
        <Banner
          title="모두 읽음으로 바꾸지 못했어요"
          description={readAll.error.message}
        />
      )}
      <NotificationListBody filter={filter} />
    </div>
  );
}
