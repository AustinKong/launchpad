import { defineConfig, defaultConfig, createSystem } from "@chakra-ui/react";

export function createThemeSystem(cardTheme) {
  if (!cardTheme) {
    return createSystem(defaultConfig);
  }

  const chakraConfig = defineConfig({
    theme: {
      tokens: {
        fonts: {
          heading: cardTheme.headingTypeface,
          body: cardTheme.bodyTypeface,
        },
      },
    },
  });
  return createSystem(defaultConfig, chakraConfig);
}
