export async function uploadDocuments({ cardId, documents }) {
  const formData = new FormData();
  documents.forEach((doc) => {
    formData.append("documents", doc);
  });

  const response = await fetch(`/api/cards/${cardId}/documents`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload documents");
  }

  const json = await response.json();
  return json.documents;
}

export async function fetchDocuments(cardId) {
  const response = await fetch(`/api/cards/${cardId}/documents`);

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  const json = await response.json();
  return json.documents;
}

export async function embedDocument(cardId, documentId) {
  const response = await fetch(`/api/cards/${cardId}/documents/${documentId}/embed`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to embed document");
  }

  const json = await response.json();
  return json.document;
}
