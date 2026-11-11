"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { Icon } from "@/components/ui/Icon";
import { InteractionOverlay } from "@/components/ui/InteractionOverlay";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { useLogout, useMe } from "@/hooks/useAuth";
import { clearAccessToken } from "@/lib/authSession";
import { useProfilePictureStore } from "@/stores/profilePictureStore";

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google 계정으로 로그인됨",
};

export function UserMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const me = useMe();
  const logoutRequest = useLogout();
  const profile = useProfilePictureStore((state) => state.profile);

  if (!me.data) return null;
  const { name, email, provider } = me.data;
  const pictureUrl =
    profile && profile.email === email ? profile.picture : undefined;

  async function logout() {
    await logoutRequest.mutateAsync().catch(() => undefined);
    clearAccessToken();
    useProfilePictureStore.getState().clear();
    queryClient.clear();
    router.replace("/login");
  }

  const providerLabel = provider
    ? PROVIDER_LABELS[provider.toLowerCase()]
    : undefined;

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
      align="end"
      aria-label="사용자 메뉴"
      className="w-65"
      header={
        <div className="flex flex-col gap-gap-xxsmall">
          <p className="text-label-small text-text-strong">{name}</p>
          {email && (
            <p className="text-subtext-medium break-all text-text-secondary">
              {email}
            </p>
          )}
          {providerLabel && (
            <p className="text-subtext-small text-text-quaternary">
              {providerLabel}
            </p>
          )}
        </div>
      }
      items={[
        {
          key: "connections",
          label: "데이터 연결",
          onSelect: () => router.push("/settings/connections"),
        },
        {
          key: "alerts",
          label: "알림 설정",
          onSelect: () => router.push("/settings/alerts"),
        },
        { type: "separator", key: "logout-separator" },
        { key: "logout", label: "로그아웃", tone: "danger", onSelect: logout },
      ]}
      trigger={(triggerProps) => (
        <button
          type="button"
          {...triggerProps}
          className="group relative flex h-9 cursor-pointer items-center gap-gap-small rounded-medium px-padding-xxsmall focus-visible:outline-2 focus-visible:outline-border-brand"
        >
          <InteractionOverlay tone="neutral" />
          <ProfileAvatar pictureUrl={pictureUrl} size={28} className="size-7" />
          <span className="relative text-label-xsmall-weak text-text-primary">
            {name}
          </span>
          <Icon name="chevron-down" className="relative text-icon-secondary" />
        </button>
      )}
    />
  );
}
