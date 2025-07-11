import { arrayMove } from "@dnd-kit/sortable";
import { deepMerge } from "@launchpad/shared";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

const useBlockDraftStore = create((set) => ({
  blockEdits: {},
  blockOrders: [],

  editActions: {
    editBlock: (blockId, patch) => {
      set((state) => ({
        blockEdits: {
          ...state.blockEdits,
          [blockId]: deepMerge(state.blockEdits[blockId] || {}, patch),
        },
      }));
    },
    createBlock: (initial) => {
      const blockId = uuidv4();
      set((state) => ({
        blockEdits: {
          ...state.blockEdits,
          [blockId]: {
            id: blockId,
            ...initial,
          },
        },
        blockOrders: [...state.blockOrders, blockId],
      }));
    },
    deleteBlock: (blockId) => {
      set((state) => {
        const { [blockId]: _, ...remainingEdits } = state.blockEdits;
        return {
          blockEdits: remainingEdits,
          blockOrders: state.blockOrders.filter((id) => id !== blockId),
        };
      });
    },
    resetBlockEdits: () => {
      set({
        blockEdits: {},
      });
    },
  },

  orderActions: {
    reorderBlocks: (activeId, overId) => {
      set((state) => {
        const { blockOrders } = state;
        const oldIndex = blockOrders.indexOf(activeId);
        const newIndex = blockOrders.indexOf(overId);
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return state;
        return {
          blockOrders: arrayMove(blockOrders, oldIndex, newIndex),
        };
      });
    },
    resetBlockOrders: (blockOrders) => {
      set({
        blockOrders: blockOrders,
      });
    },
  },
}));

export const useBlockEdits = () => useBlockDraftStore((state) => state.blockEdits);
export const useBlockOrders = () => useBlockDraftStore((state) => state.blockOrders);
export const useBlockEditActions = () => useBlockDraftStore((state) => state.editActions);
export const useBlockOrderActions = () => useBlockDraftStore((state) => state.orderActions);
