import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { GoogleProfile } from "@/lib/googleIdentity";

type ProfilePictureState = {
  profile: GoogleProfile | null;
  save: (profile: GoogleProfile | null) => void;
  clear: () => void;
};

export const useProfilePictureStore = create<ProfilePictureState>()(
  persist(
    (set) => ({
      profile: null,
      save: (profile) => set({ profile }),
      clear: () => set({ profile: null }),
    }),
    {
      name: "cloudcost.profilePicture",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
