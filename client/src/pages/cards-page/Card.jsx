import {
  HStack,
  Card as ChakraCard,
  Box,
  Avatar,
  Spacer,
  Float,
  LinkOverlay,
  LinkBox,
} from "@chakra-ui/react";
import { timeSinceNow } from "@launchpad/shared";
import { NavLink } from "react-router";

import CardActionMenu from "./CardActionMenu";

import DecorativeBox from "@/components/ui/DecorativeBox";

// TODO: Replace createdAt with editedAt
export default function Card({ card }) {
  const { title, updatedAt, slug, user } = card;

  return (
    <LinkBox
      as={ChakraCard.Root}
      overflow="hidden"
      size="sm"
      variant="outline"
      minW="xs"
      position="relative"
    >
      {/* <Image src="https://via.placeholder.com/150" alt="Card preview" /> */}
      <DecorativeBox h="250px" />
      <ChakraCard.Body>
        <HStack gap="2">
          <LinkOverlay as={NavLink} to={`/cards/${slug}`}>
            <Box>
              <ChakraCard.Title textStyle="md" fontWeight="normal">
                {title}
              </ChakraCard.Title>
              <ChakraCard.Description textStyle="xs">
                {"Private"} • Edited {timeSinceNow(updatedAt)} ago
              </ChakraCard.Description>
            </Box>
          </LinkOverlay>
          <Spacer />
          <Avatar.Root size="sm">
            <Avatar.Fallback>{user.id.slice(0, 2)}</Avatar.Fallback>
          </Avatar.Root>
        </HStack>
      </ChakraCard.Body>
      <Float offsetX="5" offsetY="5">
        <CardActionMenu card={card} />
      </Float>
    </LinkBox>
  );
}
