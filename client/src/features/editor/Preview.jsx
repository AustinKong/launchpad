import { Box, Center, ChakraProvider, Theme } from "@chakra-ui/react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToWindowEdges, snapCenterToCursor } from "@dnd-kit/modifiers";
import { fixedCursorSnapCollisionDetection, useSensors } from "@/utils/dragAndDrop";
import { deepMerge } from "@/utils/objectUtils";
import { blockRegistry } from "@/services/registryService";
import { useEffect, useMemo, useRef, useState } from "react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useBlocks } from "@/hooks/useBlocks";
import { useTheme } from "@/hooks/useTheme";

export default function Preview({ setSelectedBlockId }) {
  const { blocks, reorderBlocks } = useBlocks();
  const { theme } = useTheme();
  const [draggedBlockId, setDraggedBlockId] = useState(null);
  const sensors = useSensors();

  const cardRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    const card = cardRef.current;
    const container = containerRef.current;

    function handleClickOutside(event) {
      if (!card || !container) return;

      const clickedInsideCard = card.contains(event.target);
      const clickedInsideContainer = container.contains(event.target);

      if (!clickedInsideCard && clickedInsideContainer) {
        setSelectedBlockId(null);
      }
    }

    container.addEventListener("mousedown", handleClickOutside);
    return () => container.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <Center
        h="full"
        w="70%"
        ref={containerRef}
        bgImage={`url(${theme.backgroundImage})`}
        bgSize="cover"
        bgPosition="center"
      >
        <Box
          w="350px"
          minH="500px"
          bgColor="bg.panel"
          borderRadius="3xl"
          shadow="md"
          overflow="hidden"
          as="main"
          role="list"
          ref={cardRef}
        >
          <SortableContext
            items={blocks.map((block) => block.id)}
            strategy={verticalListSortingStrategy}
          >
            {blocks.map(({ id, type, config }) => {
              const Component = blockRegistry[type].Component;
              const { defaultConfig } = blockRegistry[type].meta;
              const mergedConfig = deepMerge(defaultConfig, config);

              return (
                <BlockWrapper
                  id={id}
                  key={id}
                  draggedBlockId={draggedBlockId}
                  setSelectedBlockId={setSelectedBlockId}
                >
                  <Component config={mergedConfig} />
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
            const icon = blockRegistry[draggedBlock.type].meta.icon;
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
