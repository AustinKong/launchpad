import {
  CloseButton,
  Dialog,
  Portal,
  Button,
  Field,
  Text,
  Input,
  FieldHelperText,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import ConfirmationController from "./ConfirmationController";

import { createSingleton } from "@/utils/createSingleton";

/**
 * Singleton confirmation controller.
 * Use `confirmation.create(...)` to show a dialog and await a user decision.
 * @type {ConfirmationController}
 */
export const confirmation = createSingleton("confirmation", () => new ConfirmationController());

export function Confirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState(null);
  const [resolver, setResolver] = useState(null);
  const [confirmText, setConfirmText] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const { title, description, cancelLabel, confirmLabel, targetText } = options || {};
  const isValid = targetText ? confirmText.trim() === targetText?.trim() : true;

  useEffect(() => {
    confirmation.register((opts, resolve) => {
      setOptions(opts);
      setResolver(() => resolve);
      setIsOpen(true);
    });
  }, []);

  function resolveAndClose(value) {
    setIsOpen(false);
    resolver?.(value);
  }

  function handleInputChange(e) {
    setConfirmText(e.target.value);
    setIsDirty(true);
  }

  return (
    <Dialog.Root
      role="alertdialog"
      open={isOpen}
      onExitComplete={() => {
        setOptions(null);
        setResolver(null);
        setConfirmText("");
        setIsDirty(false);
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            {title && (
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>
              </Dialog.Header>
            )}
            <Dialog.Body>
              {description && <Text>{description}</Text>}
              {targetText && (
                <Field.Root invalid={isDirty && !isValid} mt="4">
                  <Input placeholder={targetText} onChange={handleInputChange} />
                  <FieldHelperText>Type &quot;{targetText}&quot; to confirm</FieldHelperText>
                </Field.Root>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => resolveAndClose(false)}>
                {cancelLabel ?? "Cancel"}
              </Button>
              <Button colorPalette="red" onClick={() => resolveAndClose(true)} disabled={!isValid}>
                {confirmLabel ?? "Confirm"}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild onClick={() => resolveAndClose(false)}>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
