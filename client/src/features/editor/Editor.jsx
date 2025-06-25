import { Collapsible, Heading, VStack, Text, Button } from "@chakra-ui/react";
import { blockRegistry, fieldRegistry } from "@/services/registryService";
import { deepMerge } from "@/utils/objectUtils";
import { useBlocks } from "@/hooks/useBlocks";

export default function Editor({ selectedBlockId, setSelectedBlockId }) {
  const { blocks, createBlock, editBlock, deleteBlock, saveBlocks, saveIsLoading } = useBlocks();

  if (!selectedBlockId) {
    return (
      <VStack w="30%" bgColor="bg.panel" h="full" p="4" alignItems="stretch">
        {Object.entries(blockRegistry).map(([type, block]) => (
          <Button
            key={type}
            onClick={() =>
              createBlock({
                type,
                config: block.meta.defaultConfig,
              })
            }
          >
            Create {type}
          </Button>
        ))}
        <Button onClick={saveBlocks} disabled={saveIsLoading} loading={saveIsLoading}>
          Save
        </Button>
      </VStack>
    );
  }

  const { id, type, config } = blocks.find((block) => block.id === selectedBlockId);
  const { fields, defaultConfig } = blockRegistry[type].meta;
  // In case any part of config is missing in database, we merge it with defaultConfig
  const mergedConfig = deepMerge(defaultConfig, config);
  const groupedFields = fields.reduce((acc, { group, ...field }) => {
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {});

  return (
    <VStack w="30%" bgColor="bg.panel" h="full" p="4">
      <Heading>Editing {type.charAt(0).toUpperCase() + type.slice(1)}</Heading>
      <VStack gap="2" w="full" alignItems="stretch">
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
                    const FieldComponent = fieldRegistry[field.fieldType].Component;
                    return (
                      <FieldComponent
                        key={field.key}
                        value={mergedConfig[field.key]}
                        onChange={(value) =>
                          editBlock(selectedBlockId, { config: { [field.key]: value } })
                        }
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
        <Button
          onClick={() => {
            setSelectedBlockId(null);
            deleteBlock(id);
          }}
        >
          Delete {type}
        </Button>
        <Button onClick={saveBlocks} disabled={saveIsLoading} loading={saveIsLoading}>
          Save
        </Button>
      </VStack>
    </VStack>
  );
}
