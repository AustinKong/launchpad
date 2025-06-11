import { Text } from "@chakra-ui/react";

export const meta = {
  blockType: "paragraph",
  defaultConfig: { text: "Lorem ipsum dolor sit amet." },
  fields: [
    { key: "text", fieldType: "textarea", group: "Content", label: "Text", description: "" },
  ],
  icon: <>Bla</>,
};

export default function Paragraph({ config }) {
  return <Text>{config.text}</Text>;
}
