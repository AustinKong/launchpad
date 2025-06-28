import { createCard } from "@/services/cardService";
import { Dialog, Portal, Field, Input, InputGroup, Button, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

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

  const { mutate, isPending } = useMutation({
    mutationFn: createCard,
    onMutate: async (newCard) => {
      await queryClient.cancelQueries({ queryKey: ["cards"] });
      const previousCards = queryClient.getQueryData(["cards"]);
      queryClient.setQueryData(["cards"], (old) => [...(old || []), newCard]);
      return { previousCards };
    },
    onError: (error, newCard, context) => {
      queryClient.setQueryData(["cards"], context.previousCards);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      reset();
      onClose();
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  return (
    <Dialog.Root placement="center" size="md" open={isOpen}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={handleSubmit(({ title, slug }) => mutate({ title, slug }))}>
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
                <Button variant="outline" onClick={onClose} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isPending}>
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
