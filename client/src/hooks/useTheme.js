import { fetchTheme, saveTheme as saveThemeService } from "@/services/themeService";
import { useThemeEdits, useThemeEditActions } from "@/stores/themeDraftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { deepMerge } from "@/utils/objectUtils";
import { useMemo } from "react";

export function useTheme() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const themeEdits = useThemeEdits();
  const { editTheme, resetThemeEdits } = useThemeEditActions();

  const {
    data: card,
    isLoading: cardIsLoading,
    isError: cardIsError,
  } = useQuery({
    queryKey: ["cards"],
    queryFn: () => fetchCards(),
    select: (cards) => cards.find((card) => card.slug === slug),
  });

  const { id: cardId } = card || {};

  const {
    data: themeConfig,
    isLoading: themeIsLoading,
    isError: themeIsError,
  } = useQuery({
    queryKey: ["theme", cardId],
    queryFn: () => fetchTheme(cardId),
    enabled: !!cardId,
    select: (data) => data.config,
    onSuccess: () => {
      resetThemeEdits();
    },
  });

  const {
    mutate: saveTheme,
    isLoading: saveIsLoading,
    isError: saveIsError,
  } = useMutation({
    mutationFn: () =>
      saveThemeService({
        cardId,
        themeEdits,
      }),
    onSuccess: ({ theme: updatedTheme }) => {
      queryClient.setQueryData(["theme", cardId], updatedTheme.config);
      resetThemeEdits();
    },
  });

  const isLoading = cardIsLoading || themeIsLoading;
  const isError = cardIsError || themeIsError;

  const mergedTheme = useMemo(
    () => deepMerge(themeConfig || {}, themeEdits),
    [themeConfig, themeEdits],
  );

  return {
    theme: mergedTheme,
    isLoading,
    isError,
    saveIsLoading,
    saveIsError,

    editTheme,
    saveTheme,
  };
}
