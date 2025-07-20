"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import { ColorModeProvider } from "@/components/chakra/color-mode";

export function Provider(props) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
