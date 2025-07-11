import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { fetchCardById, fetchCardBySlug } from "@/services/card";

export function useCard({ slug = null, id = null }) {
  if (!slug && !id) {
    throw new Error("Slug or ID must be provided to useCard hook");
  }

  const queryClient = useQueryClient();
  // Namespace the keys to avoid conflicts
  const queryKey = ["card", id ? `id:${id}` : `slug:${slug}`];

  const {
    data: card,
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: () => {
      if (id) return fetchCardById(id);
      if (slug) return fetchCardBySlug(slug);
    },
    initialData: () => {
      const cards = queryClient.getQueryData(["cards"]) || [];
      return cards.find((card) => card.slug === slug || card.id === id);
    },
    enabled: !!slug || !!id,
  });

  // Normalize the cache by ensuring both id and slug caches exist
  useEffect(() => {
    if (!card) return;

    if (id) queryClient.setQueryData(["card", `id:${id}`], card);
    if (slug) queryClient.setQueryData(["card", `slug:${slug}`], card);
  }, [card, id, slug, queryClient]);

  return {
    card,
    isLoading,
    isError,
  };
}
