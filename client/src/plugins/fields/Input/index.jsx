import { Field, Input as ChakraInput } from "@chakra-ui/react";

export const meta = {
  fieldType: "input",
};

export default function Input({ value, onChange, label, description }) {
  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      {description && <Field.HelperText>{description}</Field.HelperText>}
      <ChakraInput value={value} onChange={(e) => onChange(e.target.value)} />
    </Field.Root>
  );
}
