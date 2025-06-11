import { Textarea as ChakraTextarea, Field } from "@chakra-ui/react";

export const meta = {
  fieldType: "textarea",
};

export default function Textarea({ value, onChange, label, description }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const handleChange = (e) => {
    onChange(e.target.value.replace(/[\r\n]+/g, " "));
  };

  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      {description && <Field.HelperText>{description}</Field.HelperText>}
      <ChakraTextarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck="false"
        autoresize
      />
    </Field.Root>
  );
}
