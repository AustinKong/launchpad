import { Button, Collapsible, VStack } from "@chakra-ui/react";
import { fieldRegistry } from "@/services/registryService";
import { useTheme } from "@/hooks/useTheme";

const fields = [
  {
    key: "headingTypeface",
    fieldType: "typeface",
    group: "Typography",
  },
  {
    key: "bodyTypeface",
    fieldType: "typeface",
    group: "Typography",
  },
  {
    key: "backgroundImage",
    fieldType: "image",
    aspectRatio: 16 / 9,
    group: "Background",
  },
];

export default function ThemeEditorPage() {
  const { theme, editTheme, saveTheme, saveIsLoading } = useTheme();
  const groupedFields = fields.reduce((acc, field) => {
    if (!acc[field.group]) acc[field.group] = [];
    acc[field.group].push(field);
    return acc;
  }, {});

  return (
    <VStack h="100vh">
      {Object.entries(groupedFields).map(([groupName, fields]) => (
        <Collapsible.Root key={groupName} defaultOpen w="full">
          <Collapsible.Trigger>{groupName}</Collapsible.Trigger>
          <Collapsible.Content p="2">
            <VStack gap="2" w="full">
              {fields.map((field) => {
                const { key, fieldType, ...rest } = field;
                const FieldComponent = fieldRegistry[fieldType].Component;
                return (
                  <FieldComponent
                    key={key}
                    value={theme[key]}
                    onChange={(value) => editTheme({ [key]: value })}
                    {...rest}
                  />
                );
              })}
            </VStack>
          </Collapsible.Content>
        </Collapsible.Root>
      ))}
      <Button onClick={saveTheme} disabled={saveIsLoading} loading={saveIsLoading}>
        Save Theme
      </Button>
    </VStack>
  );
}
