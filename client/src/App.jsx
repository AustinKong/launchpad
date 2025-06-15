import { useState, useEffect } from "react";
import { Center, HStack, Loader } from "@chakra-ui/react";
import Workspace from "@/components/Workspace";
import Editor from "@/components/Editor";

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

function App() {
  const [blockData, setBlockData] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  // Simulate fetching blocks from a database
  useEffect(() => {
    (async () => {
      const fetchedBlockData = await new Promise((resolve) => {
        setTimeout(() => resolve(DB_BLOCKS), 1);
      });
      setBlockData(fetchedBlockData);
    })();
  }, []);

  if (!blockData) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <HStack h="100vh" spacing={0}>
      <Workspace
        blockData={blockData}
        setBlockData={setBlockData}
        setSelectedBlockId={setSelectedBlockId}
      />
      <Editor
        blockData={blockData.find((block) => block.id === selectedBlockId)}
        setBlockData={setBlockData}
      />
    </HStack>
  );
}

export default App;
