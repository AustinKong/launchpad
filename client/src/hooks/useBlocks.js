import { deepMerge } from "@launchpad/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";

import { useCard } from "./useCard";

import { fetchBlocks } from "@/services/block";
import { saveCardBlocks } from "@/services/card";
import {
  useBlockEditActions,
  useBlockEdits,
  useBlockOrderActions,
  useBlockOrders,
} from "@/stores/blockDraftStore";
import { blockRegistry } from "@/services/registry";

export function useBlocks({ slug, id }) {
  const prevCardIdRef = useRef(null);
  const queryClient = useQueryClient();
  const blockEdits = useBlockEdits();
  const blockOrders = useBlockOrders();
  const {
    editBlock,
    deleteBlock,
    createBlock: _createBlock,
    resetBlockEdits,
  } = useBlockEditActions();
  const { reorderBlocks, resetBlockOrders } = useBlockOrderActions();

  const { card, isLoading: cardIsLoading } = useCard({ slug, id });

  const { id: cardId, blockOrders: initialBlockOrders } = card || {};

  const { data: blocks, isLoading: blocksIsLoading } = useQuery({
    queryKey: ["blocks", cardId],
    queryFn: () => fetchBlocks(cardId),
    enabled: !!cardId,
  });

  const { mutateAsync: saveBlocks, isLoading: saveIsLoading } = useMutation({
    mutationFn: () =>
      saveCardBlocks({
        id: cardId,
        blockOrders,
        blockEdits,
      }),
    onSuccess: ({ card: updatedCard, blocks: updatedBlocks }) => {
      // Do not invalidate cache here
      queryClient.setQueryData(["cards"], (oldCards) =>
        oldCards.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
      );
      queryClient.setQueryData(["blocks", cardId], updatedBlocks);

      resetBlockEdits();
      resetBlockOrders(updatedCard.blockOrders);
    },
  });

  useEffect(() => {
    if (cardId && cardId !== prevCardIdRef.current && blocks) {
      resetBlockEdits();
      resetBlockOrders(initialBlockOrders);
      prevCardIdRef.current = cardId;
    }
  }, [cardId, blocks]);

  const isLoading = blocksIsLoading || cardIsLoading;

  const mergedBlocks = useMemo(() => {
    if (!blocks || !blockOrders) return [];

    return blockOrders.map((blockId) => {
      const block = blocks.find((b) => b.id === blockId);
      const blockEdit = blockEdits[blockId] || {};
      return deepMerge(block, blockEdit);
    });
  }, [blocks, blockOrders, blockEdits]);

  function createBlock(type) {
    const { meta } = blockRegistry.get(type);
    _createBlock({
      type: meta.type,
      config: meta.defaultConfig,
    });
  }

  return {
    blocks: mergedBlocks || [],
    isLoading,
    saveIsLoading,

    editBlock,
    deleteBlock,
    createBlock,
    reorderBlocks,
    saveBlocks,
  };
}
