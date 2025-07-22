import { IconButton, Menu, Portal } from "@chakra-ui/react";
import { LuEllipsisVertical } from "react-icons/lu";
import { PiCopy, PiPen, PiShare, PiStar, PiTrash } from "react-icons/pi";

import { confirmation } from "@/utils/ui/confirmation";

export default function CardActionMenu() {
  // TODO: Create a confirmation dialog singleton that mimics confirm api from browser
  async function handleSelect({ value }) {
    switch (value) {
      case "star":
        break;
      case "edit":
        // Handle edit action
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
            targetText: "My Silly Card ID",
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
              <PiStar />
              Star
            </Menu.Item>
            <Menu.Item value="edit">
              <PiPen />
              Edit
            </Menu.Item>
            <Menu.Item value="duplicate">
              <PiCopy />
              Duplicate
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
