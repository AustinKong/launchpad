import { create } from "zustand";

const useAnalyticsEventsStore = create((set) => ({
  events: [],

  eventActions: {
    createEvent: ({ eventType, eventData }) => {
      set((state) => ({
        events: [
          ...state.events,
          {
            eventType,
            eventData,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    resetEvents: () => {
      set({
        events: [],
      });
    },
  },
}));

export const useAnalyticsEvents = () => useAnalyticsEventsStore((state) => state.events);
export const useAnalyticsEventActions = () =>
  useAnalyticsEventsStore((state) => state.eventActions);
