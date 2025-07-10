import { useModal } from "@/hooks/useModal";
import { fetchBlocks } from "@/services/blockService";
import { fetchCardBySlug } from "@/services/cardService";
import { blockRegistry } from "@/services/registryService";
import { fetchTheme } from "@/services/themeService";
import { deepMerge } from "@launchpad/shared";
import {
  Center,
  Loader,
  Box,
  ActionBar,
  Portal,
  Button,
  Dialog,
  CloseButton,
  InputGroup,
  IconButton,
  Input,
  Clipboard,
  QrCode,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";

export default function SharePage() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const {
    data: card,
    isPending: cardIsLoading,
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
    data: blocks,
    isPending: blocksIsLoading,
    isError: blocksIsError,
  } = useQuery({
    queryKey: ["blocks", cardId],
    queryFn: () => fetchBlocks(cardId),
    enabled: !!cardId,
  });

  const {
    data: theme,
    isPending: themeIsLoading,
    isError: themeIsError,
  } = useQuery({
    queryKey: ["theme", cardId],
    queryFn: () => fetchTheme(cardId),
    enabled: !!cardId,
    select: (data) => data.config,
  });

  const isLoading = cardIsLoading || blocksIsLoading || themeIsLoading;

  const { isOpen: shareIsOpen, onOpenChange: shareOnOpenChange } = useModal();

  if (isLoading) {
    return (
      <Center w="100vw" h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Center
      w="100vw"
      h="100vh"
      bgImage={`url(${theme.backgroundImage})`}
      bgSize="cover"
      bgPos="center"
    >
      <Box
        w="350px"
        minH="500px"
        bgColor="bg.panel"
        borderRadius="3xl"
        shadow="md"
        overflow="hidden"
        as="main"
        role="list"
      >
        {blocks.map(({ id, type, config }) => {
          const Component = blockRegistry.get(type).Component;
          const { defaultConfig } = blockRegistry.get(type).meta;
          const mergedConfig = deepMerge(defaultConfig, config);

          return <Component key={id} config={mergedConfig} />;
        })}
      </Box>
      <ActionBar.Root open>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <Button onClick={() => shareOnOpenChange(true)}>Share</Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
      <Dialog.Root
        open={shareIsOpen}
        placement="center"
        onOpenChange={(e) => shareOnOpenChange(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Share</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <QrCode.Root value={window.location.href} size="xl" w="full">
                  <QrCode.Frame w="full">
                    <QrCode.Pattern />
                  </QrCode.Frame>
                </QrCode.Root>
                <Clipboard.Root w="full" value={window.location.href} mt="4">
                  <Clipboard.Label textStyle="label">URL</Clipboard.Label>
                  <InputGroup
                    endElement={
                      <Clipboard.Trigger asChild>
                        <IconButton variant="surface" size="xs" me="-2">
                          <Clipboard.Indicator />
                        </IconButton>
                      </Clipboard.Trigger>
                    }
                  >
                    <Clipboard.Input asChild>
                      <Input />
                    </Clipboard.Input>
                  </InputGroup>
                </Clipboard.Root>
              </Dialog.Body>
              <Dialog.CloseTrigger asChild>
                <CloseButton />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Center>
  );
}
