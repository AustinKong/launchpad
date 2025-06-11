import FieldGroup from "@/components/FieldGroup";
import Select from "@/components/Select";

export const meta = {
  fieldType: "textStyle",
};

// Implementors should define their own mappers to map the values xs, sm, md... and normal,
// medium... to the correct size. Why? Because each implementor will interpret sizes differently.
// Also, in case we want to switch libraries, we can just change the mappers' values without
// changing the field's values.
export default function TextStyle({ value, onChange }) {
  return (
    <FieldGroup label="Text">
      <Select
        value={value.fontSize}
        items={[
          { value: "xs", label: "Extra Small" },
          { value: "sm", label: "Small" },
          { value: "md", label: "Medium" },
          { value: "lg", label: "Large" },
          { value: "xl", label: "Extra Large" },
        ]}
        onChange={(fontSize) => onChange({ ...value, fontSize })}
        variant="subtle"
        size="sm"
      />
      <Select
        value={value.fontWeight}
        items={[
          { value: "normal", label: "Normal" },
          { value: "medium", label: "Medium" },
          { value: "semibold", label: "Semi Bold" },
          { value: "bold", label: "Bold" },
        ]}
        onChange={(fontWeight) => onChange({ ...value, fontWeight })}
        variant="subtle"
        size="sm"
      />
    </FieldGroup>
  );
}
