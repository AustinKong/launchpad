import { Input as ChakraInput } from "@chakra-ui/react";

export const meta = {
  fieldType: "input",
};

export default function Input({ value, onChange }) {
  return <ChakraInput value={value} onChange={(e) => onChange(e.target.value)} />;
}
