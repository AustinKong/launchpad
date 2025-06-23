import { useState, useEffect } from "react";
import { Center, HStack, Loader } from "@chakra-ui/react";
import Preview from "@/features/editor/Preview";
import Editor from "@/features/editor/Editor";
import { useBlockActions, useBlocks } from "@/stores/blockStore";

// For testing
const DB_BLOCKS = [
  {
    id: "1",
    blockType: "heading",
    config: { text: "The cake is a lie!", textStyle: { fontSize: "xl", fontWeight: "bold" } },
  },
  { id: "2", blockType: "paragraph", config: { text: "This is my second paragraph." } },
  {
    id: "3",
    blockType: "paragraph",
    config: { text: "This is my third paragraph. I love ducks. I love React, I love Express." },
  },
];

export default function EditorPage() {
  const blocks = useBlocks();
  const { setBlocks } = useBlockActions();
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  // Simulate fetching blocks from a database
  useEffect(() => {
    (async () => {
      const fetchedBlockData = await new Promise((resolve) => {
        setTimeout(() => resolve(DB_BLOCKS), 1);
      });
      setBlocks(fetchedBlockData);
    })();
  }, []);

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
      <Editor selectedBlockId={selectedBlockId} />
    </HStack>
  );
}
