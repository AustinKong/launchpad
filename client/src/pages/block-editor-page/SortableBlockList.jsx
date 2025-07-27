import { Box } from "@chakra-ui/react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { blockRegistry } from "@/services/registry";

export default function SortableBlockList({ blocks, draggedBlockId, setSelectedBlockId }) {
  return (
    <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
      {blocks.map((block) => {
        return (
          <Block
            key={block.id}
            block={block}
            isDragging={draggedBlockId === block.id}
            setSelectedBlockId={setSelectedBlockId}
          />
        );
      })}
    </SortableContext>
  );
}

function Block({ block, isDragging, setSelectedBlockId }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: block.id,
  });
  const Component = blockRegistry.get(block.type).Component;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
    zIndex: isDragging ? 1000 : "auto",
  };

  // Allows the user to select when clicking on the block
  function handlePointerDown(event) {
    setSelectedBlockId(block.id);
    listeners.onPointerDown(event);
  }

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onPointerDown={handlePointerDown}
      tabIndex={0}
      visibility={isDragging ? "hidden" : "visible"}
    >
      <Component config={block.config} />
    </Box>
  );
}
