import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router";

import { useCard } from "@/hooks/useCard";
import { useInterval } from "@/hooks/utils/useInterval";
import { sendAnalyticsEvents, sendAnalyticsEventsWithBeacon } from "@/services/analytics";
import { useAnalyticsEventActions, useAnalyticsEvents } from "@/stores/analyticsEventsStore";

export function useAnalytics() {
  const { slug } = useParams();
  const analyticsEvents = useAnalyticsEvents();
  const { createEvent, resetEvents } = useAnalyticsEventActions();
  const { card, isLoading: cardIsLoading, isError: cardIsError } = useCard({ slug });
  const { id: cardId } = card || {};

  const {
    mutateAsync: saveAnalyticsEvents,
    isLoading: saveIsLoading,
    isError: saveIsError,
  } = useMutation({
    mutationFn: () => {
      if (!cardId || analyticsEvents.length === 0) return Promise.resolve();
      return sendAnalyticsEvents({ cardId, events: analyticsEvents });
    },
    onSuccess: () => {
      resetEvents();
    },
  });

  const saveAnalyticsEventsOnUnload = () => {
    if (analyticsEvents.length > 0) {
      sendAnalyticsEventsWithBeacon({ cardId, events: analyticsEvents });
    }
  };

  useInterval(saveAnalyticsEvents, saveAnalyticsEventsOnUnload, 30000, true);

  const isLoading = cardIsLoading || saveIsLoading;
  const isError = cardIsError || saveIsError;

  return {
    createEvent,
    isLoading,
    isError,
  };
}
