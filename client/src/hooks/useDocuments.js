import { fetchCardBySlug } from "@/services/cardService";
import { fetchDocuments, embedDocument as embedDocumentService } from "@/services/documentService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";

export function useDocuments() {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  const {
    data: card,
    isLoading: cardIsLoading,
    isError: cardIsError,
  } = useQuery({
    queryKey: ["card", slug],
    queryFn: () => fetchCardBySlug(slug),
    initialData: () => {
      const cards = queryClient.getQueryData(["cards"]) || [];
      return cards.find((card) => card.slug === slug) || undefined;
    },
  });

  const { id: cardId } = card || {};

  const {
    data: documents,
    isLoading: documentsIsLoading,
    isError: documentsIsError,
  } = useQuery({
    queryKey: ["documents", cardId],
    queryFn: () => fetchDocuments(cardId),
    enabled: !!cardId,
  });

  const {
    mutateAsync: embedDocument,
    isPending: embedIsLoading,
    isError: embedIsError,
  } = useMutation({
    mutationFn: (documentId) => embedDocumentService(cardId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries(["documents", cardId]);
    },
  });

  const isLoading = cardIsLoading || documentsIsLoading;
  const isError = cardIsError || documentsIsError;

  return {
    documents,
    isLoading,
    isError,
    embedDocument,
    embedIsLoading,
    embedIsError,
  };
}
