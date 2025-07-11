export async function fetchBlocks(cardId) {
  const response = await fetch(`/api/cards/${cardId}/blocks`);

  if (!response.ok) {
    throw new Error("Failed to fetch blocks");
  }

  const json = await response.json();
  return json.blocks;
}
