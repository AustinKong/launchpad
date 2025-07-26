import { Box, HStack, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router";

import Header from "./Header";
import { HeaderProvider } from "./HeaderContext";
import Sidebar from "./Sidebar";

export default function HomeLayout() {
  return (
    <HeaderProvider>
      <HStack h="100vh" gap="0">
        <Sidebar />
        <VStack h="full" w="full" alignItems="stretch" p="2">
          <Header />
          <Box as="main" overflowY="auto">
            <Outlet />
          </Box>
        </VStack>
      </HStack>
    </HeaderProvider>
  );
}

export { default as HeaderActions } from "./HeaderActionsAPI";
