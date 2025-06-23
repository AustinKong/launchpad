import { Avatar, Box, HStack, Spacer, VStack, Heading, Button } from "@chakra-ui/react";
import { PiNewspaper, PiCards, PiGear } from "react-icons/pi";
import { Outlet } from "react-router";
import Sidebar from "@/components/Sidebar";

const DASHBOARD_LINKS = [
  { label: "Latest News", path: "/news", icon: <PiNewspaper /> },
  { label: "My Cards", path: "/cards", icon: <PiCards /> },
  { label: "Settings", path: "/settings", icon: <PiGear /> },
];

export default function DashboardLayout() {
  return (
    <HStack w="100vw" h="100vh">
      <Sidebar links={DASHBOARD_LINKS} />
      <VStack w="full" h="full" bg="bg.main" p="0">
        <HStack as="nav" w="full" p="4">
          <Heading size="xl">Page Title</Heading>
          <Spacer />
          <Button variant="subtle">Upgrade to Pro</Button>
          <Avatar.Root size="sm">
            <Avatar.Fallback name="User Avatar" />
            <Avatar.Image src="https://bit.ly/sage-adebayo" alt="User Avatar" />
          </Avatar.Root>
        </HStack>
        <Box as="main" w="full" flex="1" overflowY="auto" p="4">
          <Outlet />
        </Box>
      </VStack>
    </HStack>
  );
}
