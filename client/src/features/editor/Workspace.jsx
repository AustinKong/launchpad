import { Box, Center } from "@chakra-ui/react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToWindowEdges, snapCenterToCursor } from "@dnd-kit/modifiers";
import { fixedCursorSnapCollisionDetection, useSensors } from "@/utils/dragAndDrop";
import { deepMerge } from "@/utils/objectUtils";
import { blockRegistry, fieldRegistry } from "@/services/registryService";
import { useState } from "react";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function Workspace({ blockData, setBlockData, setSelectedBlockId }) {
  const [draggedBlockId, setDraggedBlockId] = useState(null);
  const sensors = useSensors();

  const handleDragStart = (event) => {
    setDraggedBlockId(event.active.id);
    setSelectedBlockId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setDraggedBlockId(null);

    if (!over || active.id === over.id) return;
    handleReorderBlocks(active.id, over.id);
  };

  const handleReorderBlocks = (activeId, overId) => {
    setBlockData((prevData) => {
      const activeIndex = prevData.findIndex((block) => block.id === activeId);
      const overIndex = prevData.findIndex((block) => block.id === overId);
      return arrayMove(prevData, activeIndex, overIndex);
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={fixedCursorSnapCollisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <Center h="full" w="70%">
        <Box
          w="350px"
          minH="500px"
          bgColor="bg.panel"
          borderRadius="3xl"
          shadow="md"
          overflow="hidden"
          as="main"
          role="list"
        >
          <SortableContext
            items={blockData.map((block) => block.id)}
            strategy={verticalListSortingStrategy}
          >
            {blockData.map((blockData) => {
              const Component = blockRegistry[blockData.blockType].Component;
              const { defaultConfig } = blockRegistry[blockData.blockType].meta;
              const config = deepMerge(defaultConfig, blockData.config);

              return (
                <BlockWrapper id={blockData.id} key={blockData.id} draggedBlockId={draggedBlockId}>
                  <Component config={config} onClick={() => setSelectedBlockId(blockData.id)} />
                </BlockWrapper>
              );
            })}
          </SortableContext>
        </Box>
      </Center>
      <DragOverlay modifiers={[snapCenterToCursor]} dropAnimation={null}>
        {draggedBlockId &&
          (() => {
            const draggedBlock = blockData.find((block) => block.id === draggedBlockId);
            const icon = blockRegistry[draggedBlock.blockType].meta.icon;
            return (
              <Box h="fit-content" w="fit-content">
                {icon}
              </Box>
            );
          })()}
      </DragOverlay>
    </DndContext>
  );
}

function BlockWrapper({ id, draggedBlockId, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });
  const isDragging = draggedBlockId === id;
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
    zIndex: isDragging ? 1000 : "auto",
    // pointerEvents: draggedBlockId || draggedBlockId === 0 ? "none" : "auto",
  };

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      tabIndex={0}
      style={style}
      bgColor={isDragging ? "bg.emphasized" : "transparent"}
    >
      <Box visibility={isDragging ? "hidden" : "visible"}>{children}</Box>
    </Box>
  );
}
