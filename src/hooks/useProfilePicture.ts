"use client";

import { useAppMode } from "@/hooks/useAppMode";
import { useMe } from "@/hooks/useAuth";
import { useProfilePictureStore } from "@/stores/profilePictureStore";

export function useProfilePicture() {
  const { demo } = useAppMode();
  const me = useMe({ enabled: !demo });
  const profile = useProfilePictureStore((state) => state.profile);

  if (demo || !me.data || !profile) return undefined;
  return profile.email === me.data.email ? profile.picture : undefined;
}
