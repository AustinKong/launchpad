import { Select as ChakraSelect, createListCollection, Portal } from "@chakra-ui/react";

export default function Select({ value, items, onChange, ...rest }) {
  const collection = createListCollection({ items });

  return (
    <ChakraSelect.Root
      collection={collection}
      value={[value]}
      onValueChange={(e) => onChange(e.value[0])}
      {...rest}
    >
      <ChakraSelect.HiddenSelect />
      <ChakraSelect.Control>
        <ChakraSelect.Trigger>
          <ChakraSelect.ValueText />
        </ChakraSelect.Trigger>
        <ChakraSelect.IndicatorGroup>
          <ChakraSelect.Indicator />
        </ChakraSelect.IndicatorGroup>
      </ChakraSelect.Control>
      <Portal>
        <ChakraSelect.Positioner>
          <ChakraSelect.Content>
            {collection.items.map((item) => (
              <ChakraSelect.Item key={item.value} item={item}>
                {item.label}
              </ChakraSelect.Item>
            ))}
          </ChakraSelect.Content>
        </ChakraSelect.Positioner>
      </Portal>
    </ChakraSelect.Root>
  );
}
