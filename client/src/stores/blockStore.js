import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";

const useBlockStore = create((set, get) => ({
  blocks: null,
  actions: {
    setBlocks: (blocks) => set({ blocks }),
    updateBlock: (id, key, value) => {
      set((state) => ({
        blocks: state.blocks.map((block) =>
          block.id === id
            ? {
                ...block,
                config: {
                  ...block.config,
                  [key]: value,
                },
              }
            : block,
        ),
      }));
    },
    reorderBlocks: (activeId, overId) => {
      const { blocks } = get();
      const oldIndex = blocks.findIndex((block) => block.id === activeId);
      const newIndex = blocks.findIndex((block) => block.id === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
      set({ blocks: arrayMove(blocks, oldIndex, newIndex) });
    },
  },
}));

export const useBlocks = () => useBlockStore((state) => state.blocks);
export const useSelectedBlockId = () => useBlockStore((state) => state.selectedBlockId);
export const useBlockActions = () => useBlockStore((state) => state.actions);
