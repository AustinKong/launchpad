import { Collapsible, Heading, VStack, Text, Button, Center, Loader } from "@chakra-ui/react";
import { blockRegistry, fieldRegistry } from "@/services/registry";
import { deepMerge } from "@launchpad/shared";
import { useBlocks } from "@/hooks/useBlocks";
import { toaster } from "@/components/ui/Toaster";

export default function Editor({ selectedBlockId, setSelectedBlockId }) {
  const { blocks, createBlock, editBlock, deleteBlock, saveBlocks, saveIsLoading, isLoading } =
    useBlocks();

  function handleSave() {
    toaster.promise(saveBlocks(), {
      success: {
        title: "Blocks saved successfully",
      },
      error: {
        title: "Failed to save blocks",
      },
      loading: { title: "Saving blocks..." },
    });
  }

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (!selectedBlockId) {
    return (
      <VStack w="30%" bgColor="bg.panel" h="full" p="4" alignItems="stretch">
        {blockRegistry.list().map(({ type, meta }) => (
          <Button
            key={type}
            onClick={() =>
              createBlock({
                type,
                config: meta.defaultConfig,
              })
            }
          >
            Create {type}
          </Button>
        ))}
        <Button onClick={handleSave} disabled={saveIsLoading} loading={saveIsLoading}>
          Save
        </Button>
      </VStack>
    );
  }

  const { id, type, config } = blocks.find((block) => block.id === selectedBlockId);
  const { fields, defaultConfig } = blockRegistry.get(type).meta;
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
        {Object.entries(groupedFields).map(([groupName, fields]) => (
          <Collapsible.Root key={groupName} defaultOpen w="full">
            <Collapsible.Trigger>
              <Text w="full" fontWeight="semibold">
                {groupName}
              </Text>
            </Collapsible.Trigger>
            <Collapsible.Content p="2">
              <VStack gap="2" w="full">
                {fields.map((field) => {
                  const { key, fieldType, ...rest } = field;
                  const FieldComponent = fieldRegistry.get(fieldType).Component;
                  return (
                    <FieldComponent
                      key={key}
                      value={mergedConfig[key]}
                      onChange={(value) => editBlock(selectedBlockId, { config: { [key]: value } })}
                      {...rest}
                    />
                  );
                })}
              </VStack>
            </Collapsible.Content>
          </Collapsible.Root>
        ))}
        <Button
          onClick={() => {
            setSelectedBlockId(null);
            deleteBlock(id);
          }}
        >
          Delete {type}
        </Button>
        <Button onClick={handleSave} disabled={saveIsLoading} loading={saveIsLoading}>
          Save
        </Button>
      </VStack>
    </VStack>
  );
}
