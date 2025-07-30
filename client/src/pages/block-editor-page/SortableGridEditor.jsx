import { Box, Center } from "@chakra-ui/react";
import { DndContext, useDndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { useState } from "react";

import { blockRegistry } from "@/services/registry";

const GROUPS = [
  {
    id: "group1",
    rowSpan: 5,
  },
  {
    id: "group2",
    rowSpan: 3,
  },
];

const BLOCKS = [
  {
    id: "42e66603-0dc0-4a54-a1a5-c361fdb65d4f",
    type: "paragraph",
    groupId: "group1",
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
    groupId: "group1",
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
    groupId: "group2",
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

export default function SortableGridEdtior() {
  const [blocks, setBlocks] = useState(BLOCKS);
  const [groups, setGroups] = useState(GROUPS);

  function handleDragEnd(event) {
    // IMPORTANT: active.rect.current.translated logs to null but actually exists
    const { active, over } = event;

    if (!over) return;

    if (
      active.data.current.type === "group" &&
      over.data.current.type === "group" &&
      active.id !== over.id
    ) {
      // group reordering logic

      const activeGroupIndex = groups.findIndex((g) => g.id === active.id);
      const overGroupIndex = groups.findIndex((g) => g.id === over.id);
      setGroups((prev) => {
        return arrayMove(prev, activeGroupIndex, overGroupIndex);
      });
    }

    if (active.data.current.type === "block" && over.data.current.type === "group") {
      // reassign block to group
      if (active.groupId !== over.id) {
        setBlocks((prev) =>
          prev.map((block) => (block.id === active.id ? { ...block, groupId: over.id } : block)),
        );
      }

      // update position
      const leftInNewGroup = over.rect.left - active.rect.current.translated.left;
      const topInNewGroup = over.rect.top - active.rect.current.translated.top;

      const newColStart = Math.round(-leftInNewGroup / (COL_WIDTH + COL_GAP));
      const newRowStart = Math.round(-topInNewGroup / ROW_HEIGHT);

      setBlocks((prev) =>
        prev.map((block) =>
          block.id === active.id
            ? { ...block, colStart: newColStart, rowStart: newRowStart }
            : block,
        ),
      );
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Center h="full">
        <Box width={TOTAL_WIDTH} height="500px" bgColor="gray.900" position="relative">
          <SortableContext items={groups.map((group) => group.id)}>
            {groups.map((group) => (
              <Group
                key={group.id}
                group={group}
                blocks={blocks.filter((block) => block.groupId === group.id)}
              />
            ))}
          </SortableContext>
          <GridOverlay />
        </Box>
      </Center>
    </DndContext>
  );
}

function Group({ group, blocks }) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
  } = useSortable({ id: group.id, data: { type: "group" } });
  const { setNodeRef: setDroppableRef } = useDroppable({ id: group.id, data: { type: "group" } });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    height: `${group.rowSpan * ROW_HEIGHT}px`,
  };

  return (
    <Box
      w="full"
      position="relative"
      ref={(el) => {
        setSortableRef(el);
        setDroppableRef(el);
      }}
      {...attributes}
      {...listeners}
      style={style}
      outline="1px solid"
      outlineColor="border.info"
    >
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </Box>
  );
}

function Block({ block }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: block.id,
    data: { type: "block" },
  });
  const Component = blockRegistry.get(block.type).Component;

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    width: `${block.colSpan * COL_WIDTH + (block.colSpan - 1) * COL_GAP}px`,
    height: `${block.rowSpan * ROW_HEIGHT}px`,
    left: `${block.colStart * (COL_WIDTH + COL_GAP)}px`,
    top: `${block.rowStart * ROW_HEIGHT}px`,
  };

  return (
    <Box
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      outline="1px solid"
      outlineColor="border.error"
      position="absolute"
    >
      <Component config={block.config} />
    </Box>
  );
}

function GridOverlay() {
  const { active } = useDndContext();
  const grid = [];

  const isDragging = !!active;

  for (let i = 0; i < NUM_COLS; i++) {
    grid.push(
      <Box
        key={i}
        position="absolute"
        left={`${i * (COL_WIDTH + COL_GAP)}px`}
        top="0"
        width={`${COL_WIDTH}px`}
        height="100%"
        bg="red.100"
        opacity="0.05"
      />,
    );
  }

  return isDragging ? <>{grid}</> : null;
}
