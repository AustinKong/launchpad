import { Box, HStack, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router";

import Header from "./Header";
import { LeftPanel, RightPanel } from "./Panels";
import { PanelProvider } from "./PanelsContext";

export default function EditorLayout() {
  return (
    <PanelProvider>
      <VStack h="100vh" w="full" alignItems="stretch" gap="0">
        <Header />
        <HStack h="full" py="2" px="1">
          <LeftPanel />
          <Box as="main" flex="1" overflowY="auto" h="full">
            <Outlet />
          </Box>
          <RightPanel />
        </HStack>
      </VStack>
    </PanelProvider>
  );
}

// API exposed doesn't actually render any JSX,
// but instead provides context for the left and right panels
export { LeftPanel, RightPanel } from "./PanelsAPI";
