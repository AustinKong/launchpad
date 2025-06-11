import { Heading, VStack } from "@chakra-ui/react";
import Registry from "@/models/registry";

export default function Editor({ blockData, onConfigChange }) {
  if (!blockData) {
    return <VStack w="30%" bgColor="bg.panel" h="full" p="4"></VStack>;
  }

  const { id, blockType, config } = blockData;
  const { fields } = Registry.blocks()[blockType].meta;

  return (
    <VStack w="30%" bgColor="bg.panel" h="full" p="4">
      <Heading>Editing {blockType.charAt(0).toUpperCase() + blockType.slice(1)}</Heading>
      <VStack gap="2" w="full">
        {fields.map((field) => {
          const FieldComponent = Registry.fields()[field.fieldType].Component;

          return (
            <FieldComponent
              key={field.key}
              value={config[field.key]}
              onChange={(value) => onConfigChange(id, field.key, value)}
            />
          );
        })}
      </VStack>
    </VStack>
  );
}
