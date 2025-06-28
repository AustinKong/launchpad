import { VStack, HStack, Text, Icon, Heading } from "@chakra-ui/react";
import { PiRocketFill } from "react-icons/pi";
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
      <AppLogo />
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

function AppLogo() {
  return (
    <NavLink to="/">
      <HStack px="1" py="2" borderBottom="medium solid" borderColor="border">
        <Icon size="lg">
          <PiRocketFill />
        </Icon>
        <Heading as="h1" size="md">
          Launchpad
        </Heading>
      </HStack>
    </NavLink>
  );
}
