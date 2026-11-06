import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SelectedConnectionState = {
  accountId: string | null;
  select: (accountId: string) => void;
};

export const useSelectedConnectionStore = create<SelectedConnectionState>()(
  persist(
    (set) => ({
      accountId: null,
      select: (accountId) => set({ accountId }),
    }),
    {
      name: "cloudcost.selectedConnection",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
