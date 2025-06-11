import { Box, Center } from "@chakra-ui/react";
import Registry from "@/models/registry";

export default function Workspace({ blockData, setSelectedBlockId }) {
  return (
    <Center h="full" w="70%">
      <Box
        w="350px"
        minH="500px"
        bgColor="bg.panel"
        borderRadius="3xl"
        shadow="md"
        overflow="hidden"
        as="main"
        role="list"
      >
        {blockData.map((blockData) => {
          const Component = Registry.blocks()[blockData.blockType].Component;
          return (
            <BlockWrapper onClick={() => setSelectedBlockId(blockData.id)} key={blockData.id}>
              <Component
                config={blockData.config}
                onClick={() => setSelectedBlockId(blockData.id)}
              />
            </BlockWrapper>
          );
        })}
      </Box>
    </Center>
  );
}

function BlockWrapper({ children, onClick }) {
  return (
    <Box role="listitem" onClick={onClick} cursor="pointer">
      {children}
    </Box>
  );
}
