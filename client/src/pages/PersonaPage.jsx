import { useDocuments } from "@/hooks/useDocuments";
import { useModal } from "@/hooks/useModal";
import { getAssistantResponse } from "@/services/assistantService";
import { fetchCardBySlug } from "@/services/cardService";
import { embedDocument, uploadDocuments } from "@/services/documentService";
import {
  Box,
  Button,
  Center,
  CloseButton,
  Dialog,
  FileUpload,
  IconButton,
  Input,
  Loader,
  Portal,
  Table,
  Text,
  HStack,
  Blockquote,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PiPaperPlane } from "react-icons/pi";
import { useParams } from "react-router";

export default function PersonaPage() {
  const { isOpen, onOpenChange, open, close } = useModal();
  const { documents, isLoading, embedDocument, embedIsLoading, cardId } = useDocuments();
  const [message, setMessage] = useState("");
  const [assistantMessage, setAssistantMessage] = useState("");

  const { mutateAsync: sendMessage, isPending } = useMutation({
    mutationFn: () => getAssistantResponse({ cardId, message }),
    onSuccess: (reply) => {
      setAssistantMessage(reply);
      setMessage("");
    },
  });

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <Box p="2">
      <DocumentUploadModal isOpen={isOpen} onOpenChange={onOpenChange} close={close} />
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>File Name</Table.ColumnHeader>
            <Table.ColumnHeader>Embed</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {documents.map((document) => (
            <Table.Row key={document.id}>
              <Table.Cell>{document.id}</Table.Cell>
              <Table.Cell>{document.fileName}</Table.Cell>
              <Table.Cell>
                <Button
                  variant="outline"
                  disabled={document.isEmbedded}
                  loading={embedIsLoading}
                  onClick={() => embedDocument(document.id)}
                >
                  {document.isEmbedded ? "Embedded" : "Embed"}
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Button mt={4} onClick={open}>
        Upload more documents
      </Button>
      <Blockquote.Root w="full" mt="8">
        <Blockquote.Content>
          {assistantMessage || "Ask me anything about the documents!"}
        </Blockquote.Content>
      </Blockquote.Root>
      <HStack mt={4}>
        <Input
          w="full"
          placeholder="Send a message to the AI (TEST)"
          variant="subtle"
          disabled={isLoading}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <IconButton onClick={sendMessage} isLoading={isPending} disabled={!message}>
          <PiPaperPlane />
        </IconButton>
      </HStack>
    </Box>
  );
}

function DocumentUploadModal({ isOpen, onOpenChange, close }) {
  const { slug } = useParams();
  const [files, setFiles] = useState([]);

  const queryClient = useQueryClient();
  const { data: card } = useQuery({
    queryKey: ["card", slug],
    queryFn: () => fetchCardBySlug(slug),
    initialData: () => {
      const cards = queryClient.getQueryData(["cards"]) || [];
      return cards.find((card) => card.slug === slug) || undefined;
    },
  });

  function handleUpload(event) {
    if (!event.files || event.files.length === 0) return;

    setFiles(event.files);
  }

  async function handleSubmit() {
    const resp = await uploadDocuments({ cardId: card.id, documents: files });
    setFiles([]);
    close();
  }

  return (
    <Dialog.Root
      placement="center"
      size="md"
      open={isOpen}
      onOpenChange={(e) => onOpenChange(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger asChild>
              <CloseButton />
            </Dialog.CloseTrigger>
            <Dialog.Header>
              <Dialog.Title>Upload Document</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <FileUpload.Root
                accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.word, application/text"
                onFileAccept={handleUpload}
                maxFiles={5}
              >
                <FileUpload.HiddenInput />
                <FileUpload.Dropzone w="full">
                  <FileUpload.DropzoneContent>
                    <Text>Drag and drop your documents here</Text>
                    <Text textStyle="sm" color="fg.muted">
                      .png, .jpg up to 3MB
                    </Text>
                  </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
                <FileUpload.List />
              </FileUpload.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Button onClick={handleSubmit}>Upload</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
