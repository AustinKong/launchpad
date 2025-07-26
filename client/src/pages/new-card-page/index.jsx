import {
  InputGroup,
  Field,
  Input,
  Button,
  HStack,
  Card as ChakraCard,
  Avatar,
  WrapItem,
  Wrap,
  Center,
  Box,
  Heading,
  SegmentGroup,
  VStack,
  Spacer,
  Loader,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { PiArrowRight } from "react-icons/pi";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import { z } from "zod";

import DecorativeBox from "@/components/ui/DecorativeBox";
import { useCard } from "@/hooks/useCard";
import { useInvalidateCardCaches } from "@/hooks/useInvalidateCardCaches";
import { createCardWithTemplate } from "@/services/card";

const schema = z.object({
  title: z.string().min(1, "Card name is required"),
  slug: z
    .string()
    .min(1, "Card URL is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Card URL must be lowercase and can only contain letters, numbers, and hyphens",
    }),
  visibility: z.enum(["private", "unlisted", "public"]),
});

export default function NewCardPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { card: templateCard, isLoading: loadingTemplateCard } = useCard({
    slug: searchParams.get("template") ?? "empty-card",
  });

  const invalidate = useInvalidateCardCaches();

  const { mutate, isPending } = useMutation({
    mutationFn: createCardWithTemplate,
    onSuccess: () => {
      invalidate({ views: ["owned", "library"] });
      navigate("/cards");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      visibility: "private",
    },
  });

  if (loadingTemplateCard) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  // TODO: show template + offer big button to "explore library"
  return (
    <form onSubmit={handleSubmit((data) => mutate({ ...data, templateId: templateCard.id }))}>
      <VStack mt="8" px="48" alignItems="start">
        <Heading textStyle="2xl">Create a New Card</Heading>
        <Field.Root invalid={!!errors.title} mt="4" required>
          <Field.Label>
            Card Title
            <Field.RequiredIndicator />
          </Field.Label>
          <Input {...register("title")} />
          {errors.title ? (
            <Field.ErrorText>{errors.title.message}</Field.ErrorText>
          ) : (
            <Field.HelperText>
              This is the name of your card, it will be visible to both you and others (if you
              choose to share it).
            </Field.HelperText>
          )}
        </Field.Root>

        <Field.Root invalid={!!errors.slug} required>
          <Field.Label>
            Card URL
            <Field.RequiredIndicator />
          </Field.Label>
          <InputGroup startElement="launchpad.com/">
            <Input ps="15ch" placeholder="my-awesome-card" {...register("slug")} />
          </InputGroup>
          {errors.slug ? (
            <Field.ErrorText>{errors.slug.message}</Field.ErrorText>
          ) : (
            <Field.HelperText>
              This will be the URL for your card. It should be unique and can only contain lowercase
              letters, numbers, and hyphens.
            </Field.HelperText>
          )}
        </Field.Root>

        <CardTemplate templateCard={templateCard} />

        <Controller
          control={control}
          name="visibility"
          render={({ field }) => (
            <Field.Root invalid={!!errors.visibility}>
              <Field.Label>Visibility</Field.Label>
              <SegmentGroup.Root
                name={field.name}
                value={field.value}
                onValueChange={({ value }) => field.onChange(value)}
              >
                <SegmentGroup.Items
                  items={[
                    { label: "Private", value: "private" },
                    { label: "Unlisted", value: "unlisted" },
                    { label: "Public", value: "public" },
                  ]}
                />
                <SegmentGroup.Indicator />
              </SegmentGroup.Root>
              <Field.ErrorText>{errors.visibility?.message}</Field.ErrorText>
            </Field.Root>
          )}
        />
        <HStack w="full">
          <Spacer />
          <Button variant="outline" asChild>
            <NavLink to="/cards">Cancel</NavLink>
          </Button>
          <Button type="submit" colorPalette="blue" loading={isPending}>
            Create Card
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}

function CardTemplate({ templateCard }) {
  return (
    <Box w="full">
      <Heading textStyle="md">Card Template</Heading>
      <Wrap w="full">
        <ChakraCard.Root
          as={WrapItem}
          size="sm"
          minW="xs"
          border="medium solid"
          borderColor="border.info"
        >
          <DecorativeBox h="250px" />
          <ChakraCard.Body w="full">
            <HStack gap="2">
              <ChakraCard.Title textStyle="md" fontWeight="normal">
                {templateCard.title}
              </ChakraCard.Title>
              <Spacer />
              <Avatar.Root size="sm">
                <Avatar.Fallback>{templateCard.user.id.slice(0, 2)}</Avatar.Fallback>
              </Avatar.Root>
            </HStack>
          </ChakraCard.Body>
        </ChakraCard.Root>
        <WrapItem as={NavLink} to={"/cards/library"} minW="xs">
          <Center w="full" h="full">
            <Box>
              Explore library
              <PiArrowRight />
            </Box>
          </Center>
        </WrapItem>
      </Wrap>
    </Box>
  );
}
