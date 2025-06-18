import authFetch from "@/utils/authFetch";

export async function fetchCards(options = {}) {
  const response = await authFetch("/api/cards", options);

  if (!response.ok) {
    throw new Error("Failed to fetch cards");
  }

  const json = await response.json();
  return json.cards;
}
