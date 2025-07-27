import {
  Input,
  Highlight,
  TreeView,
  VStack,
  createTreeCollection,
  useFilter,
  Box,
  InputGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import { PiCaretRight, PiFolder, PiMagnifyingGlass, PiQuestionMark } from "react-icons/pi";

import { blockRegistry } from "@/services/registry";

const collection = createTreeCollection({
  nodeToValue: (node) => node.id,
  nodeToString: (node) => node.name,
  rootNode: {
    id: "ROOT",
    name: "",
    children: Object.entries(blockRegistry.grouped()).map(([group, blocks]) => ({
      id: group,
      name: group,
      children: blocks.map(({ meta }) => ({
        id: meta.type,
        name: meta.type,
        icon: meta.icon,
      })),
    })),
  },
});

export default function BlockList({ createBlock }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState([]);
  const { contains } = useFilter({ sensitivity: "base" });

  const filteredCollection = collection.filter((node) => contains(node.name, query));

  return (
    <VStack>
      <InputGroup startElement={<PiMagnifyingGlass />} p="2">
        <Input size="sm" onChange={(e) => setQuery(e.target.value)} variant="flushed" />
      </InputGroup>

      <TreeView.Root
        collection={filteredCollection}
        expandedValue={expanded}
        onExpandedChange={(details) => setExpanded(details.expandedValue)}
        animateContent
      >
        <TreeView.Tree>
          <TreeView.Node
            indentGuide={<TreeView.BranchIndentGuide />}
            render={({ node, nodeState }) =>
              nodeState.isBranch ? (
                <TreeView.BranchControl>
                  <PiFolder />
                  <TreeView.BranchText>
                    <Highlight query={[query]} styles={{ bg: "bg.emphasized" }}>
                      {node.name}
                    </Highlight>
                  </TreeView.BranchText>
                  <TreeView.BranchIndicator>
                    <PiCaretRight />
                  </TreeView.BranchIndicator>
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item cursor="pointer" onClick={() => createBlock(node.id)}>
                  {node.icon || <PiQuestionMark />}
                  <TreeView.ItemText>
                    <Highlight query={[query]} styles={{ bg: "bg.emphasized" }}>
                      {node.name}
                    </Highlight>
                  </TreeView.ItemText>
                </TreeView.Item>
              )
            }
          />
        </TreeView.Tree>
      </TreeView.Root>
    </VStack>
  );
}
