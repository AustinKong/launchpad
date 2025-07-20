import { HStack, Icon, Heading, Text } from "@chakra-ui/react";

import { useColorMode } from "@/components/chakra/color-mode";

export default function LogoWithText() {
  const { colorMode } = useColorMode();

  return (
    <HStack alignItems="center" py="3" px="4">
      <Icon size="md">
        {colorMode === "dark" ? (
          <img src="/logoWhite.svg" alt="logo" />
        ) : (
          <img src="/logoBlack.svg" alt="logo" />
        )}
      </Icon>
      <Heading textStyle="lg">Bonjour</Heading>
      <Text textStyle="xs" color="fg.subtle" mt="1.5">
        v0.0.1
      </Text>
    </HStack>
  );
}
