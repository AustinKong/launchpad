import { Collapsible, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";

import { blockRegistry, fieldRegistry } from "@/services/registry";

export default function BlockDetails({ block, editBlock }) {
  const { id, type, config } = block || {};
  const { fields } = blockRegistry.get(type).meta;
  const groupedFields = fields.reduce((acc, { group, ...field }) => {
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {});

  return (
    <VStack alignItems="stretch" p="4">
      {Object.entries(groupedFields).map(([group, fields]) => (
        <Group
          key={group}
          fields={fields}
          group={group}
          config={config}
          editBlock={editBlock}
          id={id}
        />
      ))}
    </VStack>
  );
}

function Group({ group, fields, config, editBlock, id }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
      <Collapsible.Trigger>
        <Text>{group}</Text>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <VStack>
          {fields.map((field) => {
            const { key, fieldType, ...rest } = field;
            const FieldComponent = fieldRegistry.get(fieldType).Component;
            return (
              <FieldComponent
                key={key}
                value={config[key]}
                onChange={(value) => editBlock(id, { config: { [key]: value } })}
                {...rest}
              />
            );
          })}
        </VStack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
