import { Center, Loader } from "@chakra-ui/react";

import { LeftPanel, RightPanel } from "@/components/layouts/editor-layout/Panels";
import ReadonlyCardPreview from "@/components/shared/ReadonlyCardPreview";
import { useBlocks } from "@/hooks/useBlocks";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeEditorPage() {
  const { blocks, isLoading: blocksIsLoading } = useBlocks();
  const { theme, isLoading: themeIsLoading } = useTheme();

  if (themeIsLoading || blocksIsLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <LeftPanel></LeftPanel>

      <Center h="full">
        <ReadonlyCardPreview blocks={blocks} theme={theme} readonly={true} />
      </Center>

      <RightPanel></RightPanel>
    </>
  );
}
