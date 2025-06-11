import { Collapsible, Heading, VStack, Text } from "@chakra-ui/react";
import Registry from "@/models/registry";
import { deepMerge } from "@/utils/objectUtils";

export default function Editor({ blockData, onConfigChange }) {
  if (!blockData) {
    return <VStack w="30%" bgColor="bg.panel" h="full" p="4"></VStack>;
  }

  const { id, blockType, config: blockConfig } = blockData;
  const { fields, defaultConfig } = Registry.blocks()[blockType].meta;
  // In case any part of config is missing in database, we merge it with defaultConfig
  const config = deepMerge(Registry.blocks()[blockType].meta.defaultConfig, blockConfig);
  const groupedFields = fields.reduce((acc, { group, ...field }) => {
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {});

  return (
    <VStack w="30%" bgColor="bg.panel" h="full" p="4">
      <Heading>Editing {blockType.charAt(0).toUpperCase() + blockType.slice(1)}</Heading>
      <VStack gap="2" w="full">
        {Object.entries(groupedFields).map(([groupName, fields]) => {
          return (
            <Collapsible.Root key={groupName} defaultOpen w="full">
              <Collapsible.Trigger>
                <Text w="full" fontWeight="semibold">
                  {groupName}
                </Text>
              </Collapsible.Trigger>
              <Collapsible.Content p="2">
                <VStack gap="2" w="full">
                  {fields.map((field) => {
                    const FieldComponent = Registry.fields()[field.fieldType].Component;
                    return (
                      <FieldComponent
                        key={field.key}
                        value={config[field.key]}
                        onChange={(value) => onConfigChange(id, field.key, value)}
                        label={field.label}
                        description={field.description}
                      />
                    );
                  })}
                </VStack>
              </Collapsible.Content>
            </Collapsible.Root>
          );
        })}
      </VStack>
    </VStack>
  );
}
