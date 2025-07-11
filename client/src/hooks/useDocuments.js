import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";

import { useCard } from "./useCard";

import { fetchDocuments, embedDocument as embedDocumentService } from "@/services/document";

export function useDocuments() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const { card, isLoading: cardIsLoading, isError: cardIsError } = useCard({ slug });

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
    cardId, // FIXME: Hacky thing to get cardId for sending message test in PersonaPage
  };
}
