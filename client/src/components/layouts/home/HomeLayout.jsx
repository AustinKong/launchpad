import { Box, HStack, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router";

import HomeHeader from "@/components/layouts/home/HomeHeader";
import { HomeHeaderProvider } from "@/components/layouts/home/HomeHeaderContext";
import HomeSidebar from "@/components/layouts/home/HomeSidebar";

export default function HomeLayout() {
  return (
    <HomeHeaderProvider>
      <HStack h="100vh" gap="0">
        <HomeSidebar />
        <VStack h="full" w="full" alignItems="stretch" p="2">
          <HomeHeader />
          <Box as="main" p="2">
            <Outlet />
          </Box>
        </VStack>
      </HStack>
    </HomeHeaderProvider>
  );
}
