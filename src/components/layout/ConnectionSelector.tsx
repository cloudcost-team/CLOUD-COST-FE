"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { Icon } from "@/components/ui/Icon";
import { InteractionOverlay } from "@/components/ui/InteractionOverlay";
import { useSelectedConnection } from "@/hooks/useSelectedConnection";
import { ConnectionStatusBadge } from "@/components/connection/ConnectionStatusBadge";

export function ConnectionSelector() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { connections, selected, select } = useSelectedConnection();

  if (!selected || connections.length < 2) return null;

  const label = (alias: string | null, regionLabel: string) =>
    `${alias ?? "이름 없는 연결"} · ${regionLabel}`;

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
      align="end"
      aria-label="연결 선택"
      items={[
        ...connections.map((account) => ({
          key: account.accountId,
          label: label(account.alias, account.regionLabel),
          badge: <ConnectionStatusBadge status={account.status} />,
          selected: account.accountId === selected.accountId,
          onSelect: () => select(account.accountId),
        })),
        { type: "separator" as const, key: "manage-separator" },
        {
          key: "manage",
          label: "연결 관리 →",
          onSelect: () => router.push("/settings/connections"),
        },
      ]}
      trigger={(triggerProps) => (
        <button
          type="button"
          {...triggerProps}
          className="group relative flex h-9 max-w-60 cursor-pointer items-center gap-gap-xsmall rounded-medium border border-border-default px-padding-small focus-visible:outline-2 focus-visible:outline-border-brand"
        >
          <InteractionOverlay tone="neutral" />
          <span className="relative truncate text-label-xsmall text-text-strong">
            {label(selected.alias, selected.regionLabel)}
          </span>
          <Icon name="chevron-down" className="relative text-icon-secondary" />
        </button>
      )}
    />
  );
}
