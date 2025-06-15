import { PiAlignLeft, PiAlignRight } from "react-icons/pi";
import { HStack } from "@chakra-ui/react";
import FieldGroup from "@/components/FieldGroup";
import StepSelect from "@/components/StepSelect";

export const meta = {
  fieldType: "margin",
};

export default function Margin({ value, onChange }) {
  return (
    <FieldGroup label="Margin">
      <HStack spacing={2}>
        <StepSelect
          value={value.left}
          items={[
            { value: "xs", label: "Extra Small" },
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
            { value: "xl", label: "Extra Large" },
          ]}
          onChange={(left) => onChange({ ...value, left })}
          variant="subtle"
          size="sm"
          startElement={<PiAlignLeft />}
        />
        <StepSelect
          value={value.right}
          items={[
            { value: "xs", label: "Extra Small" },
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
            { value: "xl", label: "Extra Large" },
          ]}
          onChange={(right) => onChange({ ...value, right })}
          variant="subtle"
          size="sm"
          startElement={<PiAlignRight />}
        />
      </HStack>
    </FieldGroup>
  );
}
