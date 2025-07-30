import { blockRegistry } from "@/services/registry";
import { Box, Center } from "@chakra-ui/react";
import { DndContext, DragOverlay, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

const BLOCKS = [
  {
    id: "42e66603-0dc0-4a54-a1a5-c361fdb65d4f",
    type: "paragraph",
    colStart: 0,
    rowStart: 0,
    colSpan: 3,
    rowSpan: 2,
    config: {
      text: "Lorem ipsum dolor sit amet.",
      textStyle: {
        fontSize: "md",
        fontWeight: "normal",
      },
      textAlign: "center",
      margin: {
        left: "md",
        right: "md",
      },
    },
  },
  {
    id: "3de17c57-2745-424c-aa69-62dd0d92c728",
    type: "heading",
    colStart: 5,
    rowStart: 3,
    colSpan: 2,
    rowSpan: 1,
    config: {
      text: "Double shot of whisky",
      textStyle: {
        fontSize: "md",
        fontWeight: "normal",
      },
      textAlign: "left",
      margin: {
        left: "md",
        right: "md",
      },
    },
  },
  {
    id: "7983c965-1693-4497-8408-f2c40b8c9c21",
    type: "button",
    colStart: 7,
    rowStart: 3,
    colSpan: 1,
    rowSpan: 1,
    config: {
      text: "Oh my good lord!!!!",
      url: "/",
    },
  },
];

const NUM_COLS = 8;
const COL_GAP = 16;
const TOTAL_WIDTH = 350;
const ROW_HEIGHT = 32;

const TOTAL_GAPS = (NUM_COLS - 1) * COL_GAP;
const COL_WIDTH = (TOTAL_WIDTH - TOTAL_GAPS) / NUM_COLS;

export default function GridEditor() {
  const [blocks, setBlocks] = useState(BLOCKS);
  const [activeId, setActiveId] = useState(null);
  const { setNodeRef } = useDroppable({ id: "grid-editor" });

  function handleDragEnd(event) {
    const { active, delta } = event;
    console.log(active);
    const block = blocks.find((b) => b.id === active.id);
    if (!block) return;

    const newLeft = block.colStart * (COL_WIDTH + COL_GAP) + delta.x;
    const newTop = block.rowStart * ROW_HEIGHT + delta.y;

    const newColStart = Math.round(newLeft / (COL_WIDTH + COL_GAP));
    const newRowStart = Math.round(newTop / ROW_HEIGHT);

    // // Clamp to grid bounds (e.g., 0–11 cols)
    // block.colStart = Math.max(0, Math.min(11, newColStart));
    // block.rowStart = Math.max(0, newRowStart);

    setBlocks((prev) =>
      prev.map((b) =>
        b.id === block.id ? { ...b, colStart: newColStart, rowStart: newRowStart } : b,
      ),
    );
  }

  return (
    <DndContext
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setActiveId(null);
      }}
    >
      <Center h="full">
        <Box ref={setNodeRef} position="relative" width="350px" height="500px" bgColor="gray.900">
          {activeId && (
            <GridOverlay
              columns={NUM_COLS}
              rows={16}
              colWidth={COL_WIDTH}
              colGap={COL_GAP}
              rowHeight={ROW_HEIGHT}
            />
          )}
          {blocks.map((block) => (
            <Block key={block.id} block={block} />
          ))}
        </Box>
      </Center>
      <DragOverlay>
        {activeId &&
          (() => {
            const Component = blockRegistry.get(
              blocks.find((block) => block.id === activeId).type,
            ).Component;
            return <Component config={blocks.find((block) => block.id === activeId).config} />;
          })()}
      </DragOverlay>
    </DndContext>
  );
}

function Block({ block }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.id,
  });

  const Component = blockRegistry.get(block.type).Component;

  // Determine snapped grid position if dragging
  let colStart = block.colStart;
  let rowStart = block.rowStart;

  if (isDragging && transform) {
    const newLeft = block.colStart * (COL_WIDTH + COL_GAP) + transform.x;
    const newTop = block.rowStart * ROW_HEIGHT + transform.y;

    colStart = Math.round(newLeft / (COL_WIDTH + COL_GAP));
    rowStart = Math.round(newTop / ROW_HEIGHT);
  }

  return (
    <Box
      bgColor={isDragging ? "gray.600" : undefined}
      position="absolute"
      left={`${colStart * (COL_WIDTH + COL_GAP)}px`}
      top={`${rowStart * ROW_HEIGHT}px`}
      width={`${block.colSpan * COL_WIDTH + (block.colSpan - 1) * COL_GAP}px`}
      height={`${block.rowSpan * ROW_HEIGHT}px`}
      opacity={1}
      ref={setNodeRef}
      zIndex={1}
      {...attributes}
      {...listeners}
    >
      {!isDragging && <Component config={block.config} />}
    </Box>
  );
}

function GridOverlay({ columns, rows, colWidth, colGap, rowHeight }) {
  const grid = [];

  // Render column blocks (light red)
  for (let col = 0; col < columns; col++) {
    grid.push(
      <Box
        key={`col-block-${col}`}
        position="absolute"
        left={`${col * (colWidth + colGap)}px`}
        top="0"
        width={`${colWidth}px`}
        height="100%"
        bg="red.100"
        opacity={0.1}
        pointerEvents="none"
      />,
    );
  }

  // Optional: Render row lines
  for (let row = 0; row < rows; row++) {
    grid.push(
      <Box
        key={`row-line-${row}`}
        position="absolute"
        top={`${row * rowHeight}px`}
        left="0"
        height="1px"
        width="100%"
        bg="whiteAlpha.300"
        pointerEvents="none"
      />,
    );
  }

  return <>{grid}</>;
}
