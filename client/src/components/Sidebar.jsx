import { VStack, HStack, Text, Icon } from "@chakra-ui/react";
import { NavLink } from "react-router";

export default function Sidebar({ links }) {
  return (
    <VStack
      as="aside"
      w="fit-content"
      h="full"
      bg="bg.panel"
      minW="3xs"
      alignItems="stretch"
      p="2"
      gap="2"
    >
      {links.map(({ label, path, icon }) => {
        return (
          <NavLink to={path} key={path}>
            {({ isActive }) => (
              <HStack
                justifyContent="flex-start"
                gap="2"
                p="2"
                _hover={isActive ? undefined : { bg: "bg.emphasized" }}
                bg={isActive ? "bg.inverted" : "transparent"}
                color={isActive ? "fg.inverted" : "fg.muted"}
                borderRadius="md"
              >
                <Icon size="sm">{icon}</Icon>
                <Text textStyle="sm">{label}</Text>
              </HStack>
            )}
          </NavLink>
        );
      })}
    </VStack>
  );
}
