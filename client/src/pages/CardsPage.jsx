import CreateCardModal from "@/features/cardsPage/CreateCardModal";
import { fetchCards } from "@/services/cardService";
import {
  ButtonGroup,
  Button,
  Center,
  EmptyState,
  Loader,
  VStack,
  Wrap,
  HStack,
  Link,
} from "@chakra-ui/react";
import { PiEmpty } from "react-icons/pi";
import { useModal } from "@/hooks/useModal";
import { NavLink } from "react-router";
import DecorativeBox from "@/components/DecorativeBox";
import { useQuery } from "@tanstack/react-query";

export default function CardsPage() {
  const { data: cards, isPending } = useQuery({
    queryKey: ["cards"],
    queryFn: fetchCards,
  });
  const {
    isOpen: createCardModalIsOpen,
    open: openCreateCardModal,
    close: closeCreateCardModal,
  } = useModal();

  if (isPending) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <CreateCardModal
        isOpen={createCardModalIsOpen}
        onClose={() => {
          closeCreateCardModal();
        }}
      />
      {!Array.isArray(cards) || cards.length === 0 ? (
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
              <Button onClick={openCreateCardModal}>Create Card</Button>
              <Button variant="outline">Import</Button>
            </ButtonGroup>
          </EmptyState.Content>
        </EmptyState.Root>
      ) : (
        <>
          <HStack>
            <Button onClick={openCreateCardModal} size="sm">
              Create Card
            </Button>
          </HStack>
          <Wrap gap="4" mt="8">
            {cards.map((card, index) => (
              <VStack key={index} w="3xs">
                <DecorativeBox h="2xs" />
                <Link asChild>
                  <NavLink to={`/cards/${card.slug}/edit`}>{card.title}</NavLink>
                </Link>
              </VStack>
            ))}
          </Wrap>
        </>
      )}
    </>
  );
}
