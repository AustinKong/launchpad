import { Center, HStack, Loader, VStack, Box, Heading, Button } from "@chakra-ui/react";

import Card from "./Card";

import { HeaderActions } from "@/components/layouts/home-layout";
import { useCards } from "@/hooks/useCards";

export default function CardsPage() {
  const { cards, isLoading } = useCards();

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <HeaderActions>
        <Button size="sm" colorPalette="blue">
          New Card
        </Button>
      </HeaderActions>
      <VStack p="4" gap="4">
        <CardsGroup title="Starred" cards={cards} />
        <CardsGroup title="Recent" cards={cards} />
        <CardsGroup title="All" cards={cards} />
      </VStack>
    </>
  );
}

function CardsGroup({ title, cards }) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <Box w="full">
      <Heading textStyle="md">{title}</Heading>
      <HStack mt="2">
        {cards.map((card) => (
          <Card card={card} key={card.id} />
        ))}
      </HStack>
    </Box>
  );
}
