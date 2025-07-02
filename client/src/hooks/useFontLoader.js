import { useState, useEffect } from "react";
import WebFont from "webfontloader";

export function useFontLoader(familiesToLoad = []) {
  const [fontsIsLoading, setFontsIsLoading] = useState(false);

  useEffect(() => {
    const validFamilies = familiesToLoad.filter(Boolean);

    if (validFamilies.length === 0) {
      return;
    }

    WebFont.load({
      google: {
        families: validFamilies,
      },
      active: () => setFontsIsLoading(true),
      inactive: () => {
        console.warn("Fonts failed to load");
        setFontsIsLoading(true);
      },
    });
  }, [familiesToLoad]);

  return fontsIsLoading;
}
