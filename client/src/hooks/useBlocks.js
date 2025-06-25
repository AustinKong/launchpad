import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useBlockEditActions,
  useBlockEdits,
  useBlockOrderActions,
  useBlockOrders,
} from "@/stores/blockDraftStore";
import { fetchBlocks } from "@/services/blockService";
import { fetchCards, saveCardBlocks } from "@/services/cardService";
import { useEffect, useMemo, useRef } from "react";
import { deepMerge } from "@/utils/objectUtils";
import { useParams } from "react-router";

export function useBlocks() {
  const { slug } = useParams();
  const prevCardIdRef = useRef(null);
  const queryClient = useQueryClient();
  const blockEdits = useBlockEdits();
  const blockOrders = useBlockOrders();
  const { editBlock, deleteBlock, createBlock, resetBlockEdits } = useBlockEditActions();
  const { reorderBlocks, resetBlockOrders } = useBlockOrderActions();

  const {
    data: card,
    isLoading: cardIsLoading,
    isError: cardIsError,
  } = useQuery({
    queryKey: ["cards"],
    queryFn: () => fetchCards(),
    select: (cards) => cards.find((card) => card.slug === slug),
  });

  const { id: cardId, blockOrders: initialBlockOrders } = card || {};

  const {
    data: blocks,
    isLoading: blocksIsLoading,
    isError: blocksIsError,
  } = useQuery({
    queryKey: ["blocks", cardId],
    queryFn: () => fetchBlocks(cardId),
    enabled: !!cardId,
  });

  const {
    mutate: saveBlocks,
    isLoading: saveIsLoading,
    isError: saveIsError,
  } = useMutation({
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
  const isError = blocksIsError || cardIsError;

  const mergedBlocks = useMemo(
    () =>
      blockOrders?.map((blockId) => {
        const block = blocks.find((b) => b.id === blockId);
        const blockEdit = blockEdits[blockId] || {};
        return deepMerge(block, blockEdit);
      }),
    [blocks, blockOrders, blockEdits],
  );

  return {
    blocks: mergedBlocks || [],
    isLoading,
    isError,
    saveIsLoading,
    saveIsError,

    editBlock,
    deleteBlock,
    createBlock,
    reorderBlocks,
    saveBlocks,
  };
}
