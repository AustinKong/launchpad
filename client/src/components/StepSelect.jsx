import { NumberInput, Select, Portal, createListCollection, HStack } from "@chakra-ui/react";

export default function StepSelect({ value, items, onChange, startElement, ...rest }) {
  const index = items.findIndex((item) => item.value === value);
  const collection = createListCollection({ items });

  const handleIncrement = () => {
    const newIndex = Math.min(index + 1, items.length - 1);
    onChange(items[newIndex].value);
  };

  const handleDecrement = () => {
    const newIndex = Math.max(index - 1, 0);
    onChange(items[newIndex].value);
  };

  return (
    <NumberInput.Root w="full" {...rest}>
      <NumberInput.Control>
        <NumberInput.IncrementTrigger
          onClick={handleIncrement}
          disabled={index >= items.length - 1}
        />
        <NumberInput.DecrementTrigger onClick={handleDecrement} disabled={index <= 0} />
      </NumberInput.Control>
      <Select.Root
        collection={collection}
        value={[value]}
        onValueChange={(e) => onChange(e.value[0])}
        {...rest}
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            {startElement ? (
              <HStack>
                {startElement}
                <Select.ValueText />
              </HStack>
            ) : (
              <Select.ValueText />
            )}
          </Select.Trigger>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {items.map((item) => (
                <Select.Item key={item.value} item={item}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </NumberInput.Root>
  );
}
