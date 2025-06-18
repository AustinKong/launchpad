import { useAutoFetch } from "@/hooks/useAutoFetch";
import { fetchCards } from "@/services/cardService";
import { Box, ButtonGroup, Button, Center, EmptyState, Loader, VStack } from "@chakra-ui/react";
import { PiEmpty } from "react-icons/pi";

export default function CardsPage() {
  const { data: cards, isLoading } = useAutoFetch(fetchCards);

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  if (cards?.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <PiEmpty />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>No Cards Found</EmptyState.Title>
            <EmptyState.Description>
              It seems like you don't have any cards yet. <br />
              Start by creating a new card or importing existing ones.
            </EmptyState.Description>
          </VStack>
          <ButtonGroup>
            <Button>Create Card</Button>
            <Button variant="outline">Import</Button>
          </ButtonGroup>
        </EmptyState.Content>
      </EmptyState.Root>
    );
  }

  return <Box>{"" + cards?.length}</Box>;
}
