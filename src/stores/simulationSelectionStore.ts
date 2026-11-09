import { create } from "zustand";

type SimulationSelection = {
  accountId: string;
  recommendationIds: string[];
  trafficGrowthPercent: number;
};

type SimulationSelectionState = {
  selection: SimulationSelection | null;
  save: (selection: SimulationSelection) => void;
};

export const useSimulationSelectionStore = create<SimulationSelectionState>(
  (set) => ({
    selection: null,
    save: (selection) => set({ selection }),
  }),
);
