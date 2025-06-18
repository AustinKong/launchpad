import { HStack, Separator, Text } from "@chakra-ui/react";

export default function LabeledSeparator({ label, ...rest }) {
  return (
    <HStack {...rest}>
      <Separator flex="1" />
      <Text flexShrink="0">{label}</Text>
      <Separator flex="1" />
    </HStack>
  );
}
