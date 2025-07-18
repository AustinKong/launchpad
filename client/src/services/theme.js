import { authFetch, beaconFetch } from "@/utils/fetchUtils";

export async function fetchTheme(cardId) {
  const response = await fetch(`/api/cards/${cardId}/theme`);

  if (!response.ok) {
    throw new Error("Failed to fetch theme");
  }

  const json = await response.json();
  return json.theme;
}

export async function saveTheme({ cardId, themeEdits }) {
  const response = await authFetch(`/api/cards/${cardId}/theme`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ themeEdits }),
  });

  if (!response.ok) {
    throw new Error("Failed to save theme");
  }

  const json = await response.json();
  return json.theme;
}

export function saveThemeWithBeacon({ cardId, themeEdits }) {
  beaconFetch(`/api/cards/${cardId}/theme`, {
    body: JSON.stringify({ themeEdits }),
  });
}
