import { Box } from "@chakra-ui/react";

import { blockRegistry } from "@/services/registry";

export default function ReadonlyCardPreview({ blocks, theme }) {
  return (
    <Box w="350px" h="500px" bgColor="pink">
      {blocks.map(({ id, type, config }) => {
        const Component = blockRegistry.get(type).Component;
        return <Component config={config} key={id} />;
      })}
    </Box>
  );
}
