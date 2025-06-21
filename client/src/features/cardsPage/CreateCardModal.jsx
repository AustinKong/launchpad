import { useAsyncRequest } from "@/hooks/useAsyncRequest";
import { createCard } from "@/services/cardService";
import { Dialog, Portal, Field, Input, InputGroup, Button, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Card name is required"),
  slug: z
    .string()
    .min(1, "Card URL is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Card URL must be lowercase and can only contain letters, numbers, and hyphens",
    }),
});

export default function CreateCardModal({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  const { run, isLoading } = useAsyncRequest(createCard, {
    onSuccess: () => {
      reset();
      onClose();
    },
    onError: (err) => {
      console.error("Error creating card:", err);
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  async function onSubmit(data) {
    const { title, slug } = data;
    run(title, slug);
  }

  return (
    <Dialog.Root placement="center" size="md" open={isOpen}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header>
                <Dialog.Title>Create a new card</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack gap="4">
                  <Field.Root invalid={!!errors.title}>
                    <Field.Label>
                      Card Title
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <Input {...register("title")} />
                    <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root invalid={!!errors.slug}>
                    <Field.Label>
                      Card URL <Field.RequiredIndicator />
                    </Field.Label>
                    <Field.HelperText>This will be seen when sharing the card.</Field.HelperText>
                    <InputGroup startElement="launchpad.com/">
                      <Input ps="15ch" placeholder="my-card" {...register("slug")} />
                    </InputGroup>
                    <Field.ErrorText>{errors.slug?.message}</Field.ErrorText>
                  </Field.Root>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  Save
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
