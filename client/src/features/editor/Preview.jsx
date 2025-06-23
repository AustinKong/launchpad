import { Box, Center } from "@chakra-ui/react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToWindowEdges, snapCenterToCursor } from "@dnd-kit/modifiers";
import { fixedCursorSnapCollisionDetection, useSensors } from "@/utils/dragAndDrop";
import { deepMerge } from "@/utils/objectUtils";
import { blockRegistry, fieldRegistry } from "@/services/registryService";
import { useState } from "react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useBlockActions, useBlocks } from "@/stores/blockStore";

export default function Preview({ setSelectedBlockId }) {
  const blocks = useBlocks();
  const { reorderBlocks } = useBlockActions();
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
    reorderBlocks(active.id, over.id);
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
            items={blocks.map((block) => block.id)}
            strategy={verticalListSortingStrategy}
          >
            {blocks.map((blockData) => {
              const Component = blockRegistry[blockData.blockType].Component;
              const { defaultConfig } = blockRegistry[blockData.blockType].meta;
              const config = deepMerge(defaultConfig, blockData.config);

              return (
                <BlockWrapper
                  id={blockData.id}
                  key={blockData.id}
                  draggedBlockId={draggedBlockId}
                  setSelectedBlockId={setSelectedBlockId}
                >
                  <Component config={config} />
                </BlockWrapper>
              );
            })}
          </SortableContext>
        </Box>
      </Center>
      <DragOverlay modifiers={[snapCenterToCursor]} dropAnimation={null}>
        {draggedBlockId &&
          (() => {
            const draggedBlock = blocks.find((block) => block.id === draggedBlockId);
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

function BlockWrapper({ id, draggedBlockId, setSelectedBlockId, children }) {
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
      onPointerDown={(e) => {
        setSelectedBlockId(id);
        listeners.onPointerDown(e);
      }}
      tabIndex={0}
      style={style}
      bgColor={isDragging ? "bg.emphasized" : "transparent"}
    >
      <Box visibility={isDragging ? "hidden" : "visible"}>{children}</Box>
    </Box>
  );
}
