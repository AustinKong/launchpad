export async function getAssistantResponse({ cardId, message }) {
  const response = await fetch(`/api/cards/${cardId}/assistant/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to get assistant response");
  }

  const json = await response.json();
  return json.reply;
}
