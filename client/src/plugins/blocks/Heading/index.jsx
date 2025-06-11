import { createMapper } from "@/utils/mappers";
import { Heading as ChakraHeading } from "@chakra-ui/react";

export const meta = {
  blockType: "heading",
  defaultConfig: {
    text: "Lorem ipsum dolor sit amet.",
    textStyle: { fontSize: "md", fontWeight: "normal" },
    textAlign: "left",
  },
  fields: [
    { key: "text", fieldType: "textarea", group: "Content", label: "Text", description: "" },
    { key: "textStyle", fieldType: "textStyle", group: "Typography" },
    { key: "textAlign", fieldType: "textAlign", group: "Typography" },
  ],
  icon: <>Bla</>,
};

export default function Heading({ config }) {
  const { text, textStyle, textAlign } = config;
  const { fontSize, fontWeight } = textStyle;

  const fontWeightMapper = createMapper(
    {
      normal: "medium",
      medium: "semibold",
      semibold: "bold",
      bold: "extrabold",
    },
    "medium",
  );

  const fontSizeMapper = createMapper(
    {
      xs: "lg",
      sm: "xl",
      md: "2xl",
      lg: "3xl",
      xl: "4xl",
    },
    "2xl",
  );

  return (
    <ChakraHeading
      textStyle={fontSizeMapper(fontSize)}
      fontWeight={fontWeightMapper(fontWeight)}
      textAlign={textAlign}
    >
      {text}
    </ChakraHeading>
  );
}
