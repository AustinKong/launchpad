import { Center, HStack, Loader, VStack, Box, Heading, Button } from "@chakra-ui/react";
import { NavLink } from "react-router";

import Card from "./Card";

import { HeaderActions } from "@/components/layouts/home-layout";
import { useCards } from "@/hooks/useCards";

export default function CardsPage() {
  const { cards: starredCards, isLoading: starredIsLoading } = useCards("starred");
  const { cards: ownedCards, isLoading: ownedIsLoading } = useCards("owned");

  if (starredIsLoading || ownedIsLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <HeaderActions>
        <Button size="sm" colorPalette="blue" asChild>
          <NavLink to="/cards/new">New Card</NavLink>
        </Button>
      </HeaderActions>
      <VStack p="4" gap="4">
        <CardsGroup title="Starred" cards={starredCards} />
        <CardsGroup title="Your Cards" cards={ownedCards} />
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
