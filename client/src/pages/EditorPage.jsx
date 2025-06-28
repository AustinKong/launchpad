import { useState } from "react";
import { Center, HStack, Loader } from "@chakra-ui/react";
import Preview from "@/features/editor/Preview";
import Editor from "@/features/editor/Editor";
import { useBlocks } from "@/hooks/useBlocks";

export default function EditorPage() {
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const { blocks } = useBlocks();

  if (!blocks) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <HStack h="100vh" spacing={0}>
      <Preview setSelectedBlockId={setSelectedBlockId} />
      <Editor selectedBlockId={selectedBlockId} setSelectedBlockId={setSelectedBlockId} />
    </HStack>
  );
}
