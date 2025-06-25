import authFetch from "@/utils/authFetch";

export async function fetchCards() {
  const response = await authFetch("/api/cards");

  if (!response.ok) {
    throw new Error("Failed to fetch cards");
  }

  const json = await response.json();
  return json.cards;
}

export async function fetchCardById(id) {
  const response = await authFetch(`/api/cards/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch card");
  }

  const json = await response.json();
  return json.card;
}

export async function fetchCardBySlug(slug) {
  const response = await authFetch(`/api/cards/slug/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch card by slug");
  }

  const json = await response.json();
  return json.card;
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

export async function saveCardBlocks({ id, blockOrders, blockEdits }) {
  const response = await authFetch(`/api/cards/${id}/batch`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      blockOrders,
      blockEdits,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save card changes");
  }

  const { card, blocks } = await response.json();
  return { card, blocks };
}
