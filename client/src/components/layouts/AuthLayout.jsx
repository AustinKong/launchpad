import { Center } from "@chakra-ui/react";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <Center w="100vw" h="100vh">
      <Outlet />
    </Center>
  );
}
