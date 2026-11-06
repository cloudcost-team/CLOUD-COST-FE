import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Currency } from "@/api/costs";

type CurrencyState = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "KRW",
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "cloudcost.currency",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
