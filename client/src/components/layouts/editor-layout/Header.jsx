import { HStack, Spacer, Tabs, Button, Box } from "@chakra-ui/react";
import { PiCaretRight, PiShare } from "react-icons/pi";
import { NavLink, useParams } from "react-router";

import Breadcrumb from "@/components/ui/Breadcrumb";
import { ColorModeButton } from "@/components/chakra/color-mode";

const TABS = [
  { label: "Blocks", value: "blocks" },
  { label: "Theme", value: "theme" },
  { label: "Assistant", value: "assistant" },
];

export default function Header() {
  const { slug } = useParams();

  return (
    <HStack
      as="header"
      h="12"
      p="2"
      alignItems="center"
      gap="2"
      bgColor="bg.panel"
      justifyContent="space-between"
    >
      <Box flex="1">
        <Breadcrumb separator={<PiCaretRight />} size="md" />
      </Box>
      <Tabs.Root defaultValue="blocks" variant="enclosed" size="sm">
        <Tabs.List>
          {TABS.map(({ label, value }) => (
            <Tabs.Trigger key={value} value={value} asChild>
              <NavLink to={`/cards/${slug}/${value}`}>{label}</NavLink>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>
      <HStack flex="1" justifyContent="flex-end">
        <ColorModeButton />
        <Button size="sm" colorPalette="blue">
          Preview <PiShare />
        </Button>
      </HStack>
    </HStack>
  );
}
