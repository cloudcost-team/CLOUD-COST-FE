import { create } from "zustand";

type SessionExpiredState = {
  expired: boolean;
  markExpired: () => void;
  reset: () => void;
};

export const useSessionExpiredStore = create<SessionExpiredState>((set) => ({
  expired: false,
  markExpired: () => set({ expired: true }),
  reset: () => set({ expired: false }),
}));
