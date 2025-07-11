import { deepMerge } from "@launchpad/shared";
import { create } from "zustand";

const useThemeDraftStore = create((set) => ({
  themeEdits: {},

  editActions: {
    editTheme: (patch) =>
      set((state) => ({
        themeEdits: deepMerge(state.themeEdits, patch),
      })),
    resetThemeEdits: () => set({ themeEdits: {} }),
  },
}));

export const useThemeEdits = () => useThemeDraftStore((state) => state.themeEdits);
export const useThemeEditActions = () => useThemeDraftStore((state) => state.editActions);
