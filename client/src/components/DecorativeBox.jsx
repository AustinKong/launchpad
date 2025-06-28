import { Box } from "@chakra-ui/react";

export default function DecorativeBox({
  w = "100%",
  h = "100px",
  borderColor = "border",
  ...props
}) {
  return (
    <Box
      width={w}
      border="thin solid"
      borderColor={borderColor}
      height={h}
      background="repeating-linear-gradient(
        -45deg,
        rgba(62, 60, 68, 0.8),
        rgba(62, 60, 68, 0.8) 5px,
        transparent 5px,
        transparent 10px
      )"
      {...props}
    />
  );
}
