import { useQuery } from "@tanstack/react-query";

import { fetchCardsByView } from "@/services/card";

export function useCards(view) {
  const {
    data: cards,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cards", view],
    queryFn: () => fetchCardsByView(view),
    enabled: !!view,
  });

  return { cards, isLoading, isError };
}
