import { HStack, Spacer } from "@chakra-ui/react";
import { PiCaretRight } from "react-icons/pi";

import { useHeader } from "./HeaderContext";

import { ColorModeButton } from "@/components/chakra/color-mode";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function Header() {
  const { actions } = useHeader();

  return (
    <HStack as="header" h="10" p="2" alignItems="center" gap="2">
      <Breadcrumb separator={<PiCaretRight />} size="lg" />
      <Spacer />
      <ColorModeButton />
      {actions}
    </HStack>
  );
}
