import { Button as ChakraButton, Link } from "@chakra-ui/react";

import { useAnalytics } from "@/hooks/useAnalytics";

export const meta = {
  type: "button",
  defaultConfig: {
    text: "Click on me!",
    url: "/",
  },
  fields: [
    { key: "text", fieldType: "textarea", group: "Content" },
    { key: "url", fieldType: "input", group: "Content" },
  ],
};

export default function Button({ config }) {
  const { text, url } = config;
  const { createEvent } = useAnalytics();

  return (
    <Link href={url} isExternal>
      <ChakraButton
        onClick={() => createEvent({ eventType: "button_click", eventData: { bla: "bla " } })}
      >
        {text}
      </ChakraButton>
    </Link>
  );
}
