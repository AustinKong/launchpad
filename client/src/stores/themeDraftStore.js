import { create } from "zustand";
import { deepMerge } from "@/utils/objectUtils";

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
