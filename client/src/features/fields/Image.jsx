import DecorativeBox from "@/components/DecorativeBox";
import ImageUploadModal from "@/components/ImageUploadModal";
import { useModal } from "@/hooks/useModal";
import { Image as ChakraImage, Field, Box } from "@chakra-ui/react";

export const meta = {
  fieldType: "image",
};

export default function Image({ value, onChange, label, description, aspectRatio }) {
  const { isOpen, open, close } = useModal();

  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      {description && <Field.HelperText>{description}</Field.HelperText>}
      {value ? (
        <ChakraImage src={value} onClick={open} />
      ) : (
        <Box onClick={open} cursor="pointer" w="full">
          <DecorativeBox />
          <Field.HelperText>No image set, click me to upload one</Field.HelperText>
        </Box>
      )}
      <ImageUploadModal
        isOpen={isOpen}
        onClose={(imageUrl) => {
          if (imageUrl) {
            onChange(imageUrl);
          }
          close();
        }}
        aspectRatio={aspectRatio}
      />
    </Field.Root>
  );
}
