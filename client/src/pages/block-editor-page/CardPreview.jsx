import { Center, Box } from "@chakra-ui/react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToWindowEdges, snapCenterToCursor } from "@dnd-kit/modifiers";
import { useState } from "react";

import SortableBlockList from "./SortableBlockList";

import { useClickedOutside } from "@/hooks/utils/useClickedOutside";
import { blockRegistry } from "@/services/registry";
import { fixedCursorSnapCollisionDetection, useSensors } from "@/utils/dragAndDrop";

export default function CardPreview({ blocks, theme, reorderBlocks, setSelectedBlockId }) {
  const sensors = useSensors();
  const [draggedBlockId, setDraggedBlockId] = useState(null);
  const { targetRef, containerRef } = useClickedOutside(handleClickOutside);

  function handleDragStart(event) {
    setDraggedBlockId(event.active.id);
    setSelectedBlockId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setDraggedBlockId(null);
    if (!!over && active.id !== over.id) reorderBlocks(active.id, over.id);
  }

  function handleClickOutside() {
    setSelectedBlockId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToWindowEdges]}
      collisionDetection={fixedCursorSnapCollisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Center h="full" ref={containerRef}>
        <Box w="350px" h="500px" bgColor="pink" ref={targetRef}>
          <SortableBlockList
            blocks={blocks}
            draggedBlockId={draggedBlockId}
            setSelectedBlockId={setSelectedBlockId}
          />
        </Box>
      </Center>
      <DragOverlay modifiers={[snapCenterToCursor]} dropAnimation={null}>
        {draggedBlockId &&
          (() => {
            const draggedBlock = blocks.find((block) => block.id === draggedBlockId);
            const Component = blockRegistry.get(draggedBlock.type).Component;
            return <Component config={draggedBlock.config} />;
          })()}
      </DragOverlay>
    </DndContext>
  );
}
