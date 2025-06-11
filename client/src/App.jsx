import { useState, useEffect } from "react";
import { Center, HStack, Loader } from "@chakra-ui/react";
import Workspace from "@/components/Workspace";
import Editor from "@/components/Editor";

// For testing
const DB_BLOCKS = [
  { id: "1", blockType: "paragraph", config: { text: "This is my first paragraph." } },
  { id: "2", blockType: "paragraph", config: { text: "This is my second paragraph." } },
];

function App() {
  const [blockData, setBlockData] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  const onConfigChange = (blockId, fieldKey, value) => {
    setBlockData((prevData) =>
      prevData.map((block) =>
        block.id === blockId ? { ...block, config: { ...block.config, [fieldKey]: value } } : block,
      ),
    );
  };

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
      <Workspace blockData={blockData} setSelectedBlockId={setSelectedBlockId} />
      <Editor
        blockData={blockData.find((block) => block.id === selectedBlockId)}
        onConfigChange={onConfigChange}
      />
    </HStack>
  );
}

export default App;
