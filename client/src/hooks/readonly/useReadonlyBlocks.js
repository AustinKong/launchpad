import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useCard } from "@/hooks/useCard";
import { fetchBlocks } from "@/services/block";

export function useReadonlyBlocks({ slug = null, id = null }) {
  const { card, isLoading: cardIsLoading } = useCard({ slug, id });

  const { data: blocks, isLoading: blocksIsLoading } = useQuery({
    queryKey: ["blocks", card?.id],
    queryFn: () => fetchBlocks(card.id),
    enabled: !!card?.id,
  });

  const orderedBlocks = useMemo(() => {
    if (!card || !blocks) return [];

    return card.blockOrders.map((blockId) => {
      const block = blocks.find((b) => b.id === blockId);
      return block;
    });
  }, [card, blocks]);

  return {
    blocks: orderedBlocks,
    isLoading: cardIsLoading || blocksIsLoading,
  };
}
