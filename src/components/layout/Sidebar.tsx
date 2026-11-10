"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/iconPaths";
import { InteractionOverlay } from "@/components/ui/InteractionOverlay";
import { useAppMode } from "@/hooks/useAppMode";
import { cn } from "@/lib/cn";

type SidebarItem = {
  label: string;
  href: string;
  icon: IconName;
  ready: boolean;
};

type SidebarGroup = { title?: string; demo: boolean; items: SidebarItem[] };

const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    demo: true,
    items: [
      { label: "대시보드", href: "/dashboard", icon: "grid", ready: true },
    ],
  },
  {
    title: "절감",
    demo: false,
    items: [
      {
        label: "낭비 리소스",
        href: "/savings/waste",
        icon: "trending-down",
        ready: true,
      },
      {
        label: "비용 시뮬레이터",
        href: "/savings/simulator",
        icon: "sliders",
        ready: true,
      },
    ],
  },
  {
    title: "비교",
    demo: true,
    items: [
      {
        label: "팀 벤치마킹",
        href: "/benchmark",
        icon: "bar-chart",
        ready: true,
      },
      {
        label: "월간 리포트",
        href: "/reports",
        icon: "file-text",
        ready: true,
      },
    ],
  },
  {
    title: "설정",
    demo: false,
    items: [
      {
        label: "데이터 연결",
        href: "/settings/connections",
        icon: "link",
        ready: true,
      },
      {
        label: "알림 설정",
        href: "/settings/alerts",
        icon: "bell",
        ready: true,
      },
    ],
  },
];

const itemClassName =
  "flex h-11 w-full items-center gap-gap-small rounded-medium px-padding-small text-label-xsmall-weak";

function SidebarLink({ item, active }: { item: SidebarItem; active: boolean }) {
  if (!item.ready)
    return (
      <span aria-disabled className={cn(itemClassName, "text-text-quaternary")}>
        <Icon name={item.icon} className="text-icon-tertiary" />
        {item.label}
        <span className="ml-auto text-subtext-small">준비 중</span>
      </span>
    );

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        itemClassName,
        "group relative focus-visible:outline-2 focus-visible:outline-border-brand",
        active
          ? "bg-fill-brand-weak text-label-xsmall text-text-brand"
          : "text-text-secondary",
      )}
    >
      {!active && <InteractionOverlay tone="neutral" />}
      <Icon
        name={item.icon}
        className={cn(
          "relative",
          active ? "text-icon-brand" : "text-icon-primary",
        )}
      />
      <span className="relative">{item.label}</span>
    </Link>
  );
}

function SidebarNav({ pathname }: { pathname: string | null }) {
  const { demo, basePath } = useAppMode();
  const groups = SIDEBAR_GROUPS.filter((group) => !demo || group.demo).map(
    (group) => ({
      ...group,
      items: group.items.map((item) => ({
        ...item,
        href: `${basePath}${item.href}`,
      })),
    }),
  );
  return (
    <nav
      aria-label="주 메뉴"
      className="flex w-60 shrink-0 flex-col gap-spacing-medium border-r border-border-default bg-background-default px-padding-small py-padding-xlarge"
    >
      {groups.map((group) => (
        <div
          key={group.title ?? "main"}
          className="flex flex-col gap-gap-xxsmall"
        >
          {group.title && (
            <p className="px-padding-small py-padding-xsmall text-subtext-small text-text-tertiary">
              {group.title}
            </p>
          )}
          {group.items.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              active={
                pathname !== null &&
                (pathname === item.href || pathname.startsWith(`${item.href}/`))
              }
            />
          ))}
        </div>
      ))}
    </nav>
  );
}

function ActiveSidebarNav() {
  return <SidebarNav pathname={usePathname()} />;
}

export function Sidebar() {
  return (
    <Suspense fallback={<SidebarNav pathname={null} />}>
      <ActiveSidebarNav />
    </Suspense>
  );
}
