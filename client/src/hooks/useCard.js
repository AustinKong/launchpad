import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { fetchCardById, fetchCardBySlug } from "@/services/cardService";

export function useCard({ slug = null, id = null }) {
  if (!slug && !id) {
    throw new Error("Slug or ID must be provided to useCard hook");
  }

  const queryClient = useQueryClient();
  const {
    data: card,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["card", id ? id : slug],
    queryFn: () => {
      if (id) return fetchCardById(id);
      if (slug) return fetchCardBySlug(slug);
    },
    initialData: () => {
      const cards = queryClient.getQueryData(["cards"]) || [];
      return cards.find((card) => card.slug === slug || card.id === id) || undefined;
    },
    enabled: !!slug || !!id,
  });

  // Normalize the cache by ensuring both id and slug caches exist
  useEffect(() => {
    if (!card) return;

    if (slug && !queryClient.getQueryData(["card", slug])) {
      queryClient.setQueryData(["card", slug], card);
    }
    if (id && !queryClient.getQueryData(["card", id])) {
      queryClient.setQueryData(["card", id], card);
    }
  }, [card, id, slug, queryClient]);

  return {
    card,
    isLoading,
    isError,
  };
}
