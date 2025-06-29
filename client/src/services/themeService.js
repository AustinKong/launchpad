import authFetch from "@/utils/authFetch";

export async function fetchTheme(cardId) {
  const response = await authFetch(`/api/cards/${cardId}/theme`);

  if (!response.ok) {
    throw new Error("Failed to fetch theme");
  }

  const json = await response.json();
  return json.theme;
}

export async function saveTheme({ cardId, themeEdits }) {
  const response = await authFetch(`/api/cards/${cardId}/theme`, {
    method: "PUT",
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
