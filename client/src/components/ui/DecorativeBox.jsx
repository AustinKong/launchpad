import { Box, useToken } from "@chakra-ui/react";

export default function DecorativeBox({
  w = "100%",
  h = "100px",
  borderColor = "border",
  ...props
}) {
  const [fgSubtle] = useToken("colors", ["fg.subtle"]);

  return (
    <Box
      width={w}
      border="thin solid"
      borderColor={borderColor}
      height={h}
      background={`repeating-linear-gradient(
        -45deg,
        ${fgSubtle},
        ${fgSubtle} 10px,
        transparent 10px,
        transparent 20px
      )`}
      {...props}
    />
  );
}
