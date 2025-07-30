import { Box, Center } from "@chakra-ui/react";
import { DndContext, useDndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { useRef, useState } from "react";

import { blockRegistry } from "@/services/registry";
import { useSensors } from "@/utils/dragAndDrop";
import { useClickedOutside } from "@/hooks/utils/useClickedOutside";

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
    colEnd: 3,
    rowStart: 0,
    rowEnd: 2,
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
    colEnd: 7,
    rowStart: 3,
    rowEnd: 4,
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
    colEnd: 8,
    rowStart: 3,
    rowEnd: 4,
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
  const [hoveredGroupId, setHoveredGroupId] = useState(null);
  const [hoveredBlockId, setHoveredBlockId] = useState(null);
  const [selected, setSelected] = useState({
    id: null,
    type: null, // "block" | "group"
  });
  const resizingRef = useRef({
    blockId: null,
    original: { colStart: 0, colEnd: 0, rowStart: 0, rowEnd: 0 },
    direction: null, // "n"|"s"|"w"|"e"
  });
  const groupResizingRef = useRef({
    groupId: null,
    originalRowSpan: 0,
    direction: null, // "n"|"s"
    originalPositions: {}, // { [blockId]: { rowStart, rowEnd } }
  });
  const [dragPreview, setDragPreview] = useState(null);

  const { containerRef, targetRef } = useClickedOutside(() => {
    setSelected({ id: null, type: null });
    setHoveredGroupId(null);
    setHoveredBlockId(null);
  });

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
      // if (active.groupId !== over.id) {
      //   setBlocks((prev) =>
      //     prev.map((block) => (block.id === active.id ? { ...block, groupId: over.id } : block)),
      //   );
      // }

      // // update position
      // const leftInNewGroup = over.rect.left - active.rect.current.translated.left;
      // const topInNewGroup = over.rect.top - active.rect.current.translated.top;

      // const newColStart = Math.round(-leftInNewGroup / (COL_WIDTH + COL_GAP));
      // const newRowStart = Math.round(-topInNewGroup / ROW_HEIGHT);

      // setBlocks((prev) =>
      //   prev.map((block) => {
      //     if (block.id !== active.id) return block;

      //     const width = block.colEnd - block.colStart;
      //     const height = block.rowEnd - block.rowStart;

      //     return {
      //       ...block,
      //       colStart: newColStart,
      //       colEnd: newColStart + width,
      //       rowStart: newRowStart,
      //       rowEnd: newRowStart + height,
      //     };
      //   }),
      // );
      const targetGroup = groups.find((g) => g.id === over.id);
      const oldBlock = blocks.find((b) => b.id === active.id);
      const width = oldBlock.colEnd - oldBlock.colStart;
      const height = oldBlock.rowEnd - oldBlock.rowStart;

      if (height > targetGroup.rowSpan) {
        setDragPreview({
          groupId: oldBlock.groupId,
          colStart: oldBlock.colStart,
          rowStart: oldBlock.rowStart,
          width,
          height,
        });
        return;
      }

      // compute & clamp the drop position exactly as we do in handleDragMove:
      const leftInNewGroup = over.rect.left - active.rect.current.translated.left;
      const topInNewGroup = over.rect.top - active.rect.current.translated.top;

      let colStart = Math.round(-leftInNewGroup / (COL_WIDTH + COL_GAP));
      let rowStart = Math.round(-topInNewGroup / ROW_HEIGHT);

      // clamp into valid range
      colStart = Math.max(0, Math.min(NUM_COLS - width, colStart));
      rowStart = Math.max(0, Math.min(targetGroup.rowSpan - height, rowStart));

      // commit the move
      setBlocks((prev) =>
        prev.map((block) => {
          if (block.id !== active.id) return block;
          return {
            ...block,
            groupId: over.id,
            colStart,
            colEnd: colStart + width,
            rowStart,
            rowEnd: rowStart + height,
          };
        }),
      );
    }

    if (active.data.current.type === "resize") {
      // resizing logic
      resizingRef.current = { blockId: null, originalEnd: null, direction: null };
    }

    if (active.data.current.type === "group-resize") {
      groupResizingRef.current = {
        groupId: null,
        originalRowSpan: 0,
        direction: null,
        originalPositions: {},
      };
    }

    setDragPreview(null);
  }

  function handleDragStart(event) {
    const { active } = event;

    if (active.data.current.type === "group-resize") {
      const { groupId, direction } = active.data.current;
      const grp = groups.find((g) => g.id === groupId);
      // stash every block’s original start/end
      const originalPositions = {};
      blocks
        .filter((b) => b.groupId === groupId)
        .forEach((b) => {
          originalPositions[b.id] = {
            rowStart: b.rowStart,
            rowEnd: b.rowEnd,
          };
        });
      groupResizingRef.current = {
        groupId,
        originalRowSpan: grp.rowSpan,
        direction,
        originalPositions,
      };
    }

    if (active.data.current.type === "resize") {
      const { blockId, direction } = active.data.current;
      const blk = blocks.find((b) => b.id === blockId);
      resizingRef.current = {
        blockId,
        direction,
        original: {
          colStart: blk.colStart,
          colEnd: blk.colEnd,
          rowStart: blk.rowStart,
          rowEnd: blk.rowEnd,
        },
      };
    }
  }

  function handleDragMove(event) {
    const { active, delta, over } = event;

    if (active.data.current.type === "block" && over?.data.current.type === "group") {
      const blk = blocks.find((b) => b.id === active.id);
      const targetGroup = groups.find((g) => g.id === over.id);
      const width = blk.colEnd - blk.colStart;
      const height = blk.rowEnd - blk.rowStart;

      // ── If block is taller than this group, snap preview to original:
      if (height > targetGroup.rowSpan) {
        setDragPreview({
          groupId: blk.groupId,
          colStart: blk.colStart,
          rowStart: blk.rowStart,
          width,
          height,
        });
        return;
      }

      // ── **NEW**: if this block is taller than the group's rowSpan, cancel preview
      if (height > targetGroup.rowSpan) {
        setDragPreview(null);
        return;
      }

      // find pointer’s offset into group
      const leftInNewGroup = over.rect.left - active.rect.current.translated.left;
      const topInNewGroup = over.rect.top - active.rect.current.translated.top;

      let colStart = Math.round(-leftInNewGroup / (COL_WIDTH + COL_GAP));
      let rowStart = Math.round(-topInNewGroup / ROW_HEIGHT);

      // clamp into group
      colStart = Math.max(0, Math.min(NUM_COLS - width, colStart));
      rowStart = Math.max(0, Math.min(targetGroup.rowSpan - height, rowStart));

      setDragPreview({
        groupId: over.id,
        colStart,
        rowStart,
        width,
        height,
      });
      return; // skip the rest
    }

    // otherwise clear it
    setDragPreview(null);

    if (active.data.current.type === "group-resize") {
      const { groupId, originalRowSpan, direction, originalPositions } = groupResizingRef.current;
      const rawDelta = Math.round(delta.y / ROW_HEIGHT);

      const groupBlocks = blocks.filter((b) => b.groupId === groupId);

      let d = rawDelta;
      if (direction === "n") {
        // shrinking from the top: max we can shrink is until the topmost block
        const minStart = Math.min(...Object.values(originalPositions).map((p) => p.rowStart));
        // rawDelta > minStart would push that block past rowStart=0
        d = Math.min(rawDelta, minStart);
      } else {
        // shrinking from the bottom: bottom‐most block’s rowEnd must stay ≤ newSpan
        const maxEnd = Math.max(...groupBlocks.map((b) => b.rowEnd));
        // require originalRowSpan + d ≥ maxEnd  ⇒  d ≥ maxEnd - originalRowSpan
        d = Math.max(rawDelta, maxEnd - originalRowSpan);
      }
      const newSpan = direction === "n" ? originalRowSpan - d : originalRowSpan + d;
      setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, rowSpan: newSpan } : g)));

      if (direction === "n") {
        setBlocks((prev) =>
          prev.map((b) => {
            if (b.groupId !== groupId) return b;
            const orig = originalPositions[b.id];
            // shift _up_ by d, but we've already clamped so it stays ≥0
            const newStart = orig.rowStart - d;
            const height = orig.rowEnd - orig.rowStart;
            return {
              ...b,
              rowStart: newStart,
              rowEnd: newStart + height,
            };
          }),
        );
      }
      return;
    }

    if (active.data.current.type == "resize") {
      const { blockId, direction, original } = resizingRef.current;
      const deltaCols = Math.round(delta.x / (COL_WIDTH + COL_GAP));
      const deltaRows = Math.round(delta.y / ROW_HEIGHT);

      setBlocks((prev) =>
        prev.map((block) => {
          if (block.id !== blockId) return block;
          let { colStart, colEnd, rowStart, rowEnd } = original;
          const group = groups.find((g) => g.id === block.groupId);
          const maxRows = group?.rowSpan ?? rowEnd;

          switch (direction) {
            case "n":
              // drag top edge → shift rowStart, never cross rowEnd-1
              rowStart = Math.min(Math.max(0, original.rowStart + deltaRows), original.rowEnd - 1);
              break;
            case "s":
              // drag bottom edge → shift rowEnd, never go above rowStart+1
              rowEnd = Math.min(
                maxRows,
                Math.max(original.rowStart + 1, original.rowEnd + deltaRows),
              );
              break;
            case "w":
              // drag left edge → shift colStart
              colStart = Math.min(Math.max(0, original.colStart + deltaCols), original.colEnd - 1);
              break;
            case "e":
              // drag right edge → shift colEnd
              colEnd = Math.min(
                NUM_COLS,
                Math.max(original.colStart + 1, original.colEnd + deltaCols),
              );
              break;
          }

          return { ...block, colStart, colEnd, rowStart, rowEnd };
        }),
      );
    }
  }

  const sensors = useSensors();

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <Center h="full" ref={containerRef}>
        <Box
          width={TOTAL_WIDTH}
          height="500px"
          bgColor="gray.900"
          position="relative"
          ref={targetRef}
        >
          <SortableContext items={groups.map((group) => group.id)}>
            {groups.map((group) => (
              <Group
                key={group.id}
                group={group}
                blocks={blocks.filter((block) => block.groupId === group.id)}
                selected={selected}
                setSelected={setSelected}
                hoveredGroupId={hoveredGroupId}
                setHoveredGroupId={setHoveredGroupId}
                hoveredBlockId={hoveredBlockId}
                setHoveredBlockId={setHoveredBlockId}
                dragPreview={dragPreview}
              />
            ))}
          </SortableContext>
          <GridOverlay />
        </Box>
      </Center>
    </DndContext>
  );
}

function Group({
  group,
  blocks,
  selected,
  setSelected,
  hoveredGroupId,
  setHoveredGroupId,
  hoveredBlockId,
  setHoveredBlockId,
  dragPreview,
}) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
  } = useSortable({ id: group.id, data: { type: "group" } });

  const { setNodeRef: setDroppableRef, isOver: isOverGroup } = useDroppable({
    id: group.id,
    data: { type: "group" },
  });

  const { active } = useDndContext();

  // flags for each drag state
  const isSortingGroup = active?.data.current.type === "group";
  const isActiveThisGroup = isSortingGroup && active.id === group.id;

  const isResizingGroup = active?.data.current.type === "group-resize";
  const isResizingThisGroup = isResizingGroup && active.data.current.groupId === group.id;

  const isBlockResizing = active?.data.current.type === "resize";
  const isResizingThisBlockGroup =
    isBlockResizing && blocks.some((b) => b.id === active.data.current.blockId);

  // Compute whether to outline this group
  let showOutline;
  if (isSortingGroup) {
    // only the dragged‑group
    showOutline = isActiveThisGroup;
  } else if (isResizingGroup) {
    // only the group being resized
    showOutline = isResizingThisGroup;
  } else if (isBlockResizing) {
    // only the group containing the block being resized
    showOutline = isResizingThisBlockGroup;
  } else {
    // normal drop‑hover
    showOutline = isOverGroup;
  }

  // allow hover/selection only when not sorting or resizing
  const hoverOrSelect =
    (!isSortingGroup &&
      !isResizingGroup &&
      !isBlockResizing &&
      hoveredGroupId === group.id &&
      hoveredBlockId === null) ||
    (selected.type === "group" && selected.id === group.id);

  showOutline = showOutline || hoverOrSelect;

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
      data-component-name={`group:${group.id}`}
      style={style}
      outline="2px solid"
      outlineColor={showOutline ? "blue.500" : "transparent"}
      onPointerDown={(event) => {
        setSelected({ id: group.id, type: "group" });
        listeners.onPointerDown(event);
      }}
      onPointerEnter={() => {
        if (!isResizingGroup && !isBlockResizing) {
          setHoveredGroupId(group.id);
        }
      }}
      onPointerLeave={() => {
        if (!isResizingGroup && !isBlockResizing) {
          setHoveredGroupId(null);
        }
      }}
    >
      {dragPreview?.groupId === group.id && (
        <Box
          pointerEvents="none"
          position="absolute"
          left={`${dragPreview.colStart * (COL_WIDTH + COL_GAP)}px`}
          top={`${dragPreview.rowStart * ROW_HEIGHT}px`}
          width={`${dragPreview.width * COL_WIDTH + (dragPreview.width - 1) * COL_GAP}px`}
          height={`${dragPreview.height * ROW_HEIGHT}px`}
          bg="blue.300"
          opacity={0.3}
          zIndex={5}
        />
      )}

      {blocks.map((block) => (
        <Block
          key={block.id}
          block={block}
          selected={selected}
          setSelected={setSelected}
          hoveredBlockId={hoveredBlockId}
          setHoveredBlockId={setHoveredBlockId}
        />
      ))}

      {selected.type === "group" && selected.id === group.id && (
        <>
          <GroupResizeHandle groupId={group.id} direction="n" key="north" />
          <GroupResizeHandle groupId={group.id} direction="s" key="south" />
        </>
      )}

      <Box
        position="absolute"
        top="0"
        left="0"
        transform="translateY(-100%)"
        bg="blue.500"
        color="white"
        fontSize="xs"
        px="1"
        py="0.5"
        zIndex="10"
        visibility={showOutline ? "visible" : "hidden"}
      >
        {group.id}
      </Box>
    </Box>
  );
}

function Block({ block, selected, setSelected, hoveredBlockId, setHoveredBlockId }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: block.id,
    data: { type: "block" },
  });
  const Component = blockRegistry.get(block.type).Component;

  const blockWidth =
    (block.colEnd - block.colStart) * COL_WIDTH + (block.colEnd - block.colStart - 1) * COL_GAP;
  const blockHeight = (block.rowEnd - block.rowStart) * ROW_HEIGHT;

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    width: `${blockWidth}px`,
    height: `${blockHeight}px`,
    left: `${block.colStart * (COL_WIDTH + COL_GAP)}px`,
    top: `${block.rowStart * ROW_HEIGHT}px`,
  };

  const { active } = useDndContext();
  const isResizingGroup = active?.data.current.type === "group-resize";
  const isDraggingBlock = active?.data.current.type === "block";
  const isResizing = active?.data.current.type === "resize";
  const isActiveThisBlock = isDraggingBlock
    ? active.id === block.id
    : isResizing
      ? active.data.current.blockId === block.id
      : false;

  const isBlockHovered = hoveredBlockId === block.id;

  let showOutline = false;
  if (isDraggingBlock || isResizing) {
    showOutline = isActiveThisBlock;
  } else {
    showOutline = isBlockHovered;
  }
  if (selected.type === "block" && selected.id === block.id) {
    showOutline = true;
  }

  if (isResizingGroup) {
    showOutline = false;
  }

  return (
    <Center
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      outline="2px solid"
      outlineColor={showOutline ? "blue.500" : "transparent"}
      position="absolute"
      // _hover={{ outlineColor: "border.info" }}
      // data-component-name={`block:${block.id}`}
      onPointerDown={(event) => {
        // prevent groups handler from being triggered
        // This is always picked first over group onPointerDown handler because
        // this is a child of the group and is deeper in the DOM tree
        event.stopPropagation();
        setSelected({ id: block.id, type: "block" });
        listeners.onPointerDown(event);
      }}
      onPointerEnter={() => {
        // if (!isDraggingBlock && !isResizing) {
        //   setHoveredBlockId(block.id);
        // }
        if (!isResizingGroup) {
          setHoveredBlockId(block.id);
        }
      }}
      onPointerLeave={() => {
        if (!isResizingGroup) {
          setHoveredBlockId(null);
        }
        // if (!isDraggingBlock && !isResizing) {
        //   setHoveredBlockId(null);
        // }
      }}
      zIndex="10"
    >
      <Component config={block.config} />
      {selected.type === "block" &&
        selected.id === block.id && [
          <ResizeHandle key="northHandle" blockId={block.id} direction="n" />,
          <ResizeHandle key="southHandle" blockId={block.id} direction="s" />,
          <ResizeHandle key="westHandle" blockId={block.id} direction="w" />,
          <ResizeHandle key="eastHandle" blockId={block.id} direction="e" />,
        ]}
      <Box
        position="absolute"
        top="0"
        left="0"
        transform="translateY(-100%)"
        bg="blue.500"
        color="white"
        fontSize="xs"
        px="1"
        py="0.5"
        zIndex="10"
        visibility={showOutline ? "visible" : "hidden"}
        // css={{
        //   [`[data-component-name="block:${block.id}"]:hover &`]: {
        //     visibility: "visible",
        //   },
        // }}
      >
        {block.type}
      </Box>
    </Center>
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

function ResizeHandle({ blockId, direction }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `resize-handle-${direction}-${blockId}`,
    data: { type: "resize", blockId, direction },
  });

  const edgeStyles = {
    n: { top: 0, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" },
    s: { bottom: 0, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" },
    w: { left: 0, top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" },
    e: { right: 0, top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" },
  }[direction];

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      position="absolute"
      {...edgeStyles}
      width="10px"
      height="10px"
      bgColor="blue.500"
      cursor="nwse-resize"
    />
  );
}

function GroupResizeHandle({ groupId, direction }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `resize-group-${direction}-${groupId}`,
    data: { type: "group-resize", groupId, direction },
  });

  const edgeStyles = {
    n: { top: 0, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" },
    s: { bottom: 0, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" },
  }[direction];

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      position="absolute"
      {...edgeStyles}
      width="100%"
      height="6px"
      bgColor="blue.500"
      cursor="ns-resize"
      zIndex={10}
    />
  );
}
