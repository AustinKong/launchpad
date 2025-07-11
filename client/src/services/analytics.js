import { beaconFetch } from "@/utils/fetchUtils";

export async function sendAnalyticsEvents({ cardId, events }) {
  const response = await fetch(`/api/cards/${cardId}/analytics/batch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ events }),
  });

  if (!response.ok) {
    throw new Error("Failed to create analytics events");
  }

  const json = await response.json();
  return json.events;
}

export function sendAnalyticsEventsWithBeacon({ cardId, events }) {
  beaconFetch(`/api/cards/${cardId}/analytics/batch`, {
    body: JSON.stringify({ events }),
  });
}
