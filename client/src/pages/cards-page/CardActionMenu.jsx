import { IconButton, Menu, Portal } from "@chakra-ui/react";
import { LuEllipsisVertical } from "react-icons/lu";
import {
  PiCaretRight,
  PiCopy,
  PiEye,
  PiEyeClosed,
  PiEyeSlash,
  PiShare,
  PiStar,
  PiStarFill,
  PiTrash,
} from "react-icons/pi";
import { NavLink } from "react-router";

import { Tooltip } from "@/components/ui/tooltip";
import { useInvalidateCardCaches } from "@/hooks/useInvalidateCardCaches";
import { starCard, unstarCard } from "@/services/card";
import { confirmation } from "@/utils/ui/confirmation";

// TODO: make this work
export default function CardActionMenu({ card }) {
  const { id, isStarred, visibility, slug } = card;
  const invalidate = useInvalidateCardCaches();

  async function handleSelect({ value }) {
    switch (value) {
      case "star":
        isStarred ? await unstarCard(id) : await starCard(id);
        invalidate({ id });
        break;
      case "duplicate":
        // Handle duplicate action
        break;
      case "share":
        // Handle share action
        break;
      case "delete":
        if (
          await confirmation.create({
            title: "Delete Card",
            description: "Are you sure you want to delete this card? This action cannot be undone.",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
            targetText: slug,
          })
        ) {
          console.log("Card deleted");
        }
        // Handle delete action
        break;
    }
  }

  return (
    <Menu.Root onSelect={handleSelect}>
      <Menu.Trigger asChild>
        <IconButton variant="ghost" rounded="full">
          <LuEllipsisVertical />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="star">
              {isStarred ? (
                <>
                  <PiStar />
                  Unstar
                </>
              ) : (
                <>
                  <PiStarFill />
                  Star
                </>
              )}
            </Menu.Item>

            <VisibilityMenu visibility={visibility} />

            <Menu.Item value="as-template" asChild>
              <NavLink to={`/cards/new?template=${card.slug}`}>
                <PiCopy />
                Use as template
              </NavLink>
            </Menu.Item>

            <Menu.Item value="share">
              <PiShare />
              Share
            </Menu.Item>

            <Menu.Item
              color="fg.error"
              _hover={{ bg: "bg.error", color: "fg.error" }}
              value="delete"
            >
              <PiTrash />
              Delete
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

function VisibilityMenu({ visibility }) {
  const VISIBILIY = [
    {
      value: "PUBLIC",
      icon: <PiEye />,
      label: "Public",
      tooltip: "Can be found in library, visible to everyone",
      selected: visibility === "PUBLIC",
    },
    {
      value: "UNLISTED",
      icon: <PiEyeSlash />,
      label: "Unlisted",
      tooltip: "Visible only to those with a link",
      selected: visibility === "UNLISTED",
    },
    {
      value: "PRIVATE",
      icon: <PiEyeClosed />,
      label: "Private",
      tooltip: "Visible only to you",
      selected: visibility === "PRIVATE",
    },
  ];

  return (
    <Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
      <Menu.TriggerItem value="visibility">
        <PiEye />
        Change visibility
        <PiCaretRight />
      </Menu.TriggerItem>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {VISIBILIY.map(({ value, icon, label, tooltip, selected }) => (
              <Tooltip key={value} content={tooltip}>
                <Menu.Item value={value} disabled={selected}>
                  {icon}
                  {label}
                </Menu.Item>
              </Tooltip>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
