import { Text } from "@chakra-ui/react";

import { createMapper } from "@/utils/mappers";

export const meta = {
  type: "paragraph",
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

export default function Paragraph({ config }) {
  const { text, textStyle, textAlign, margin } = config;

  const fontWeightMapper = createMapper({
    normal: "normal",
    medium: "medium",
    semibold: "semibold",
    bold: "bold",
  });

  const fontSizeMapper = createMapper({
    xs: "xs",
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
  });

  const marginMapper = createMapper({
    xs: "0.5",
    sm: "1",
    md: "3",
    lg: "6",
    xl: "8",
  });

  return (
    <Text
      fontSize={fontSizeMapper(textStyle.fontSize)}
      fontWeight={fontWeightMapper(textStyle.fontWeight)}
      textAlign={textAlign}
      marginLeft={marginMapper(margin.left)}
      marginRight={marginMapper(margin.right)}
    >
      {text}
    </Text>
  );
}
