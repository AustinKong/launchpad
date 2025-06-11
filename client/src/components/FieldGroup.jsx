import { HStack, Text, VStack } from "@chakra-ui/react";

export default function FieldGroup({ label, children }) {
  return (
    <HStack justifyContent="space-between" w="full">
      <Text flex="0 0 30%" color="fg.subtle" mb="auto" mt="1">
        {label}
      </Text>
      <VStack flex="0 0 70%" alignItems="stretch">
        {children}
      </VStack>
    </HStack>
  );
}
