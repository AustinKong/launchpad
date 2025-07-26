import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { fetchCardById, fetchCardBySlug } from "@/services/card";

export function useCard({ slug = null, id = null }) {
  const queryClient = useQueryClient();
  const queryKey = id || slug ? ["card", id ? `id:${id}` : `slug:${slug}`] : null;

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
      if (!id && !slug) return undefined;

      const views = ["starred", "owned", "archived", "library"];
      for (const view of views) {
        const cached = queryClient.getQueryData(["cards", view]);
        if (!cached) continue;
        const match = cached.find((card) => card.id === id || card.slug === slug);
        if (match) return match;
      }
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
