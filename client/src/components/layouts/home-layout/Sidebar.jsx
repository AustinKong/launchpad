import { Box, Text, Heading, HStack, Icon, VStack, Spacer } from "@chakra-ui/react";
import { PiCards, PiBook, PiGear, PiQuestion, PiBug, PiArchive, PiStar } from "react-icons/pi";
import { NavLink as RouterLink } from "react-router";

import LogoWithText from "@/components/ui/LogoWithText";
import { useCards } from "@/hooks/useCards";

export default function Sidebar() {
  const { cards: starredCards, isLoading } = useCards("starred");

  return (
    <VStack
      w="xs"
      as="aside"
      h="full"
      alignItems="stretch"
      bg="bg.subtle"
      borderRight="md"
      borderColor="border.muted"
    >
      <LogoWithText />
      <>
        <NavGroup
          title="Card Management"
          links={[
            { label: "My Cards", path: "/cards", icon: <PiCards /> },
            { label: "Library", path: "/library", icon: <PiBook /> },
            { label: "Archived", path: "/archived", icon: <PiArchive /> },
          ]}
        />
        {!isLoading && starredCards.length > 0 && (
          <NavGroup
            title="Starred"
            links={starredCards.map((card) => ({
              label: card.title,
              path: `/cards/${card.slug}`,
              icon: <PiStar />,
            }))}
          />
        )}
        <NavGroup
          title="General"
          links={[
            { label: "Settings", path: "/settings", icon: <PiGear /> },
            { label: "Help", path: "/help", icon: <PiQuestion /> },
            { label: "Report a Bug", path: "/report-a-bug", icon: <PiBug /> },
          ]}
        />
      </>
      <Spacer />
      <Alert />
    </VStack>
  );
}

function NavGroup({ title, links }) {
  return (
    <Box pl="3" pr="2">
      <Heading textStyle="md">{title}</Heading>
      <VStack alignItems="stretch" gap="0.5" mt="1">
        {links.map(({ label, path, icon }) => (
          <NavLink key={path} path={path} label={label} icon={icon} />
        ))}
      </VStack>
    </Box>
  );
}

function NavLink({ path, label, icon }) {
  return (
    <RouterLink to={path}>
      {({ isActive }) => (
        <HStack
          bg={isActive ? "bg.emphasized" : undefined}
          color={isActive ? "fg" : "fg.subtle"}
          _hover={isActive ? undefined : { bg: "bg.muted" }}
          py="1"
          px="2"
          borderRadius="md"
          role="link"
        >
          <Icon size="md">{icon}</Icon>
          <Text>{label}</Text>
        </HStack>
      )}
    </RouterLink>
  );
}

function Alert() {
  return <Box p="2">Important alerts go here</Box>;
}
