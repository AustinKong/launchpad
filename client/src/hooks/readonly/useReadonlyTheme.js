import { useQuery } from "@tanstack/react-query";

import { useCard } from "@/hooks/useCard";
import { fetchTheme } from "@/services/theme";

export function useReadonlyTheme({ id, slug }) {
  const { card, isLoading: cardIsLoading } = useCard({ id, slug });

  const { data: theme, isLoading: themeIsLoading } = useQuery({
    queryKey: ["theme", card?.id],
    queryFn: () => fetchTheme(card.id),
    enabled: !!card?.id,
  });

  return {
    theme,
    isLoading: cardIsLoading || themeIsLoading,
  };
}
