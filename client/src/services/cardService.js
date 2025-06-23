import authFetch from "@/utils/authFetch";

export async function fetchCards() {
  const response = await authFetch("/api/cards");

  if (!response.ok) {
    throw new Error("Failed to fetch cards");
  }

  const json = await response.json();
  return json.cards;
}

export async function createCard({ title, slug }) {
  const response = await authFetch("/api/cards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      slug,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create card");
  }

  const json = await response.json();
  return json.card;
}
