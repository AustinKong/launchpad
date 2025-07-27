import { Card, HStack, IconButton, Spacer, Tabs, useTabs } from "@chakra-ui/react";
import { PiSidebarSimple } from "react-icons/pi";

import { useLeftPanel, useRightPanel } from "./PanelsContext";

function Panel({ panel }) {
  const tabs = useTabs({ defaultValue: 0 });

  if (!panel || panel.length === 0) return null;

  return (
    <Card.Root h="full" w="sm" as="aside" size="sm">
      <Tabs.RootProvider variant="plain" value={tabs}>
        <Card.Header as={HStack} p="0">
          <Tabs.List pointerEvents={panel.length === 1 ? "none" : "auto"}>
            {panel.map(({ label }, index) => (
              <Tabs.Trigger key={index} value={index}>
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          <Spacer />
          <IconButton variant="ghost">
            <PiSidebarSimple />
          </IconButton>
        </Card.Header>
        <Card.Body p="0">
          {panel.map(({ content }, index) => (
            <Tabs.Content value={index} key={index} p="0">
              {content}
            </Tabs.Content>
          ))}
        </Card.Body>
      </Tabs.RootProvider>
    </Card.Root>
  );
}

export function LeftPanel() {
  const { leftPanel } = useLeftPanel();
  return <Panel panel={leftPanel} />;
}

export function RightPanel() {
  const { rightPanel } = useRightPanel();
  return <Panel panel={rightPanel} />;
}
