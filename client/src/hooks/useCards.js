import { useQuery } from "@tanstack/react-query";

import { fetchCards } from "@/services/card";

export function useCards() {
  const {
    data: cards,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cards"],
    queryFn: fetchCards,
  });

  return { cards, isLoading, isError };
}
