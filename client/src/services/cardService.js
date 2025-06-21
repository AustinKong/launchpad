import authFetch from "@/utils/authFetch";

export async function fetchCards(options = {}) {
  const response = await authFetch("/api/cards", options);

  if (!response.ok) {
    throw new Error("Failed to fetch cards");
  }

  const json = await response.json();
  return json.cards;
}

export async function createCard(title, slug, options = {}) {
  const response = await authFetch("/api/cards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      slug,
    }),
    ...options,
  });

  if (!response.ok) {
    throw new Error("Failed to create card");
  }

  const json = await response.json();
  return json.card;
}
