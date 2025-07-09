import { fetchTheme, saveTheme as saveThemeService } from "@/services/themeService";
import { useThemeEdits, useThemeEditActions } from "@/stores/themeDraftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCardBySlug } from "@/services/cardService";
import { useParams } from "react-router";
import { deepMerge } from "@launchpad/shared";
import { useMemo } from "react";
import { useFontLoader } from "./useFontLoader";

const typefaceKeys = ["headingTypeface", "bodyTypeface"];

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
    queryKey: ["card", slug],
    // FIXME: Find a way to use card ID instead of slug
    queryFn: () => fetchCardBySlug(slug),
    initialData: () => {
      const cards = queryClient.getQueryData(["cards"]) || [];
      return cards.find((card) => card.slug === slug) || undefined;
    },
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

  const mergedTheme = useMemo(
    () => deepMerge(themeConfig || {}, themeEdits),
    [themeConfig, themeEdits],
  );

  const { fontsIsLoading } = useFontLoader(typefaceKeys.map((key) => mergedTheme[key]));

  const isLoading = cardIsLoading || themeIsLoading || fontsIsLoading;
  const isError = cardIsError || themeIsError;

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
