import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useBlockEditActions,
  useBlockEdits,
  useBlockOrderActions,
  useBlockOrders,
} from "@/stores/blockDraftStore";
import { fetchBlocks } from "@/services/blockService";
import { fetchCardById, fetchCards, saveCardBlocks } from "@/services/cardService";
import { useEffect, useMemo, useState } from "react";
import { deepMerge } from "@/utils/objectUtils";
import { useParams } from "react-router";

export function useBlocks() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const blockEdits = useBlockEdits();
  const blockOrders = useBlockOrders();
  const { editBlock, deleteBlock, createBlock, resetBlocks } = useBlockEditActions();
  const { reorderBlocks } = useBlockOrderActions();

  const {
    data: cardId,
    isLoading: cardIdIsLoading,
    isError: cardIdIsError,
  } = useQuery({
    queryKey: ["cards"],
    queryFn: () => fetchCards(),
    select: (cards) => {
      const cardId = cards.find((card) => card.slug === slug)?.id;
      if (!cardId) {
        throw new Error("Card doesn't exist for this user");
      }
      return cardId;
    },
  });

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
    data: card,
    isLoading: cardIsLoading,
    isError: cardIsError,
  } = useQuery({
    queryKey: ["card", cardId],
    queryFn: () => fetchCardById(cardId),
    enabled: !!cardId,
    initialData: () => {
      const allCards = queryClient.getQueryData(["cards"]);
      return allCards?.find((card) => card.id === cardId);
    },
  });

  const {
    mutate: saveBlocks,
    isLoading: isSaving,
    isError: saveIsError,
  } = useMutation({
    mutationFn: () =>
      saveCardBlocks({
        id: cardId,
        blockOrders,
        blockEdits,
      }),
    onMutate: async ({ card, blocks }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["blocks", cardId] });
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });

      const previousBlocks = queryClient.getQueryData(["blocks", cardId]);
      const previousCard = queryClient.getQueryData(["card", cardId]);

      queryClient.setQueryData(["blocks", cardId], blocks);
      queryClient.setQueryData(["card", cardId], card);
      resetBlocks(card.blockOrders);

      return { previousBlocks, previousCard };
    },
    onError: (err, _, { previousBlocks, previousCard }) => {
      queryClient.setQueryData(["blocks", cardId], previousBlocks);
      queryClient.setQueryData(["card", cardId], previousCard);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["blocks", cardId] });
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
    },
  });

  const isLoading = blocksIsLoading || cardIsLoading || isSaving;
  const isError = blocksIsError || cardIsError || saveIsError;

  const mergedBlocks = useMemo(
    () =>
      blockOrders?.map((blockId) => {
        const blockEdit = blockEdits[blockId];
        return deepMerge(blocks[blockId], blockEdit);
      }),
    [blocks, blockOrders, blockEdits],
  );

  /*
    Logic:
    1. After getting blockOrder from server, immediately update client state (if there is no)
        Then, discard blockOrder and never use block order from server again. Thereafter, only
        refer to client state's blockOrder
    2. Based on client state blockOrder, map each id to the corresponding block object (from 
        server state). Then apply changes by directly overwriting keys specified in blockEdits
        using deepMerge
    3. Return only an array of block objects. The order is encoded in the order of the array

    Expose also:
    1. A function to modify block order
    2. A function to edit a block's config
    3. A function to delete a block
    4. A function to create a block
  */

  return {
    blocks: mergedBlocks || [],
    isLoading,
    isError,
    editBlock,
    deleteBlock,
    createBlock,
    reorderBlocks,
    saveBlocks,
  };
}
