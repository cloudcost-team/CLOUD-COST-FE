import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SimulationSelection = {
  accountId: string;
  recommendationIds: string[];
  trafficGrowthPercent: number;
};

export type BenchmarkView = "current" | "after";

type SimulationSelectionState = {
  selection: SimulationSelection | null;
  benchmarkView: BenchmarkView;
  save: (selection: SimulationSelection) => void;
  setBenchmarkView: (view: BenchmarkView) => void;
};

export const useSimulationSelectionStore = create<SimulationSelectionState>()(
  persist(
    (set) => ({
      selection: null,
      benchmarkView: "current",
      save: (selection) => set({ selection }),
      setBenchmarkView: (benchmarkView) => set({ benchmarkView }),
    }),
    {
      name: "cloudcost.simulationSelection",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
