import { Textarea as ChakraTextarea } from "@chakra-ui/react";

export const meta = {
  fieldType: "textarea",
};

export default function Textarea({ value, onChange }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const handleChange = (e) => {
    onChange(e.target.value.replace(/[\r\n]+/g, " "));
  };

  return (
    <ChakraTextarea
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      spellCheck="false"
      autoresize
    />
  );
}
