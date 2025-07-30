import { useState } from "react";
import { useParams } from "react-router";

import CardPreview from "./CardPreview";

import { LeftPanel, RightPanel } from "@/components/layouts/editor-layout";
import { useReadonlyTheme } from "@/hooks/readonly/useReadonlyTheme";
import { useBlocks } from "@/hooks/useBlocks";
import BlockList from "./BlockList";
import BlockDetails from "./BlockDetails";
import GridEditor from "./GridEditor";
import SortableGridEdtior from "./SortableGridEditor";

export default function BlockEditorPage() {
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const { slug } = useParams();

  const { theme, isLoading: themeIsLoading } = useReadonlyTheme({ slug });
  const {
    blocks,
    reorderBlocks,
    createBlock,
    editBlock,
    isLoading: blocksIsLoading,
  } = useBlocks({ slug });

  return (
    <>
      <LeftPanel>
        <LeftPanel.Tab label="Blocks">
          <BlockList createBlock={createBlock} />
        </LeftPanel.Tab>
        <LeftPanel.Tab label="Tab2">
          <div>Content for Tab 2</div>
        </LeftPanel.Tab>
      </LeftPanel>

      {/* <GridEditor blocks={blocks} /> */}
      <SortableGridEdtior />

      {/* <CardPreview
        theme={theme}
        blocks={blocks}
        reorderBlocks={reorderBlocks}
        setSelectedBlockId={setSelectedBlockId}
      /> */}

      <RightPanel>
        <RightPanel.Tab label="Details">
          {selectedBlockId && (
            <BlockDetails
              block={blocks.find((b) => b.id === selectedBlockId)}
              editBlock={editBlock}
            />
          )}
        </RightPanel.Tab>
      </RightPanel>
    </>
  );
}
