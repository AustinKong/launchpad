import { HStack, Spacer } from "@chakra-ui/react";
import { PiCaretRight } from "react-icons/pi";

import { ColorModeButton } from "@/components/chakra/color-mode";
import { useHomeHeader } from "@/components/layouts/home/HomeHeaderContext";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function HomeHeader() {
  const { actions } = useHomeHeader();

  return (
    <HStack as="header" h="10" p="2" alignItems="center" gap="2">
      <Breadcrumb separator={<PiCaretRight />} size="lg" />
      <Spacer />
      <ColorModeButton />
      <HStack>{actions}</HStack>
    </HStack>
  );
}
