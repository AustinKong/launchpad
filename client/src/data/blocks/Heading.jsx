import { Heading as ChakraHeading } from "@chakra-ui/react";
import { PiTextH } from "react-icons/pi";

import { useTheme } from "@/hooks/useTheme";
import { createMapper } from "@/utils/mappers";

export const meta = {
  type: "heading",
  group: "Content",
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
  icon: <PiTextH />,
};

export default function Heading({ config }) {
  const { theme } = useTheme();
  const { headingTypeface } = theme;
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
      fontFamily={headingTypeface}
    >
      {text}
    </ChakraHeading>
  );
}
