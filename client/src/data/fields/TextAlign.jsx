import { SegmentGroup } from "@chakra-ui/react";
import {
  PiTextAlignCenter,
  PiTextAlignJustify,
  PiTextAlignLeft,
  PiTextAlignRight,
} from "react-icons/pi";

import Fieldset from "@/components/Fieldset";

export const meta = {
  fieldType: "textAlign",
};

export default function TextAlign({ value, onChange }) {
  const items = [
    { value: "left", label: <PiTextAlignLeft /> },
    { value: "center", label: <PiTextAlignCenter /> },
    { value: "right", label: <PiTextAlignRight /> },
    { value: "justify", label: <PiTextAlignJustify /> },
  ];

  return (
    <Fieldset label="Align">
      <SegmentGroup.Root value={value} onValueChange={(e) => onChange(e.value)} size="sm">
        <SegmentGroup.Indicator />
        <SegmentGroup.Items items={items} w="full" />
      </SegmentGroup.Root>
    </Fieldset>
  );
}
