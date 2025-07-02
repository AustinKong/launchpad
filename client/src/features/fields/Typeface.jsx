import Fieldset from "@/components/Fieldset";
import { Select, Portal, createListCollection } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import WebFont from "webfontloader";

export const meta = {
  fieldType: "typeface",
};

export default function Typeface({ value, onChange }) {
  const typefaces = createListCollection({
    items: [
      { label: "Roboto", value: "Roboto" },
      { label: "Open Sans", value: "Open Sans" },
      { label: "Lato", value: "Lato" },
      { label: "Montserrat", value: "Montserrat" },
      { label: "Poppins", value: "Poppins" },
      { label: "Arial", value: "Arial" },
      { label: "Helvetica", value: "Helvetica" },
      { label: "Times New Roman", value: "Times New Roman" },
      { label: "Courier New", value: "Courier New" },
    ],
  });

  return (
    <Fieldset label="Typeface">
      <Select.Root
        value={[value]}
        collection={typefaces}
        onValueChange={(e) => onChange(e.value[0])}
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content maxH="100px">
              {typefaces.items.map((typeface) => (
                <TypefaceOption key={typeface.value} item={typeface} />
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Fieldset>
  );
}

function TypefaceOption({ item }) {
  const optionRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          WebFont.load({
            google: {
              families: [item.value],
            },
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (optionRef.current) {
      observer.observe(optionRef.current);
    }
    return () => observer.disconnect();
  }, [item.value]);

  return (
    <Select.Item ref={optionRef} item={item} fontFamily={item.value}>
      {item.label}
    </Select.Item>
  );
}
