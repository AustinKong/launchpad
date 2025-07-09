import { PiCards, PiEye, PiGear, PiPicnicTable, PiShare } from "react-icons/pi";
import { Avatar, Box, HStack, Spacer, VStack, Heading, IconButton } from "@chakra-ui/react";
import { Outlet, useParams } from "react-router";
import Sidebar from "@/components/Sidebar";

export default function WorkspaceLayout() {
  const { slug } = useParams();

  const EDITOR_LINKS = [
    { label: "Editor", path: `/cards/${slug}/edit`, icon: <PiCards /> },
    { label: "Theme", path: `/cards/${slug}/theme`, icon: <PiPicnicTable /> },
    { label: "Persona", path: `/cards/${slug}/persona`, icon: <PiGear /> },
  ];

  return (
    <HStack w="100vw" h="100vh">
      <Sidebar links={EDITOR_LINKS} />
      <VStack w="full" h="full" bg="bg.main" p="0">
        <HStack as="nav" w="full" p="4">
          <Heading size="xl">Card Title Here</Heading>
          <Spacer />
          <IconButton size="sm" variant="plain">
            <PiEye />
          </IconButton>
          <IconButton size="sm" variant="plain">
            <PiShare />
          </IconButton>
          <Avatar.Root size="sm">
            <Avatar.Fallback name="User Avatar" />
            <Avatar.Image src="https://bit.ly/sage-adebayo" alt="User Avatar" />
          </Avatar.Root>
        </HStack>
        <Box as="main" w="full" flex="1" overflowY="auto">
          <Outlet />
        </Box>
      </VStack>
    </HStack>
  );
}
