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
  const payload = JSON.stringify({ events });
  const blob = new Blob([payload], { type: "application/json" });
  navigator.sendBeacon(`/api/cards/${cardId}/analytics/batch`, blob);
}
