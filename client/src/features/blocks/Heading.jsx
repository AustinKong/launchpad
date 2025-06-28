import { createMapper } from "@/utils/mappers";
import { Heading as ChakraHeading } from "@chakra-ui/react";

export const meta = {
  type: "heading",
  defaultConfig: {
    text: "Lorem ipsum dolor sit amet.",
    textStyle: { fontSize: "md", fontWeight: "normal" },
    textAlign: "left",
    margin: { left: "md", right: "md" },
  },
  fields: [
    { key: "text", fieldType: "textarea", group: "Content", label: "Text", description: "" },
    { key: "textStyle", fieldType: "textStyle", group: "Typography" },
    { key: "textAlign", fieldType: "textAlign", group: "Typography" },
    { key: "margin", fieldType: "margin", group: "Spacing" },
  ],
  icon: <>Bla</>,
};

export default function Heading({ config }) {
  const { text, textStyle, textAlign, margin } = config;

  const fontWeightMapper = createMapper({
    normal: "medium",
    medium: "semibold",
    semibold: "bold",
    bold: "extrabold",
  });

  const fontSizeMapper = createMapper({
    xs: "lg",
    sm: "xl",
    md: "2xl",
    lg: "3xl",
    xl: "4xl",
  });

  const marginMapper = createMapper({
    xs: "0.5",
    sm: "1",
    md: "3",
    lg: "6",
    xl: "8",
  });

  return (
    <ChakraHeading
      textStyle={fontSizeMapper(textStyle.fontSize)}
      fontWeight={fontWeightMapper(textStyle.fontWeight)}
      textAlign={textAlign}
      marginLeft={marginMapper(margin.left)}
      marginRight={marginMapper(margin.right)}
    >
      {text}
    </ChakraHeading>
  );
}
