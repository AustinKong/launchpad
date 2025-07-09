import { Box, Image as ChakraImage } from "@chakra-ui/react";

export const meta = {
  type: "profile banner",
  defaultConfig: {
    profileImage: "https://picsum.photos/200/200",
    bannerImage: "https://picsum.photos/300/100",
  },
  fields: [
    {
      key: "profileImage",
      fieldType: "image",
      group: "Content",
      label: "Profile Image",
      aspectRatio: 1 / 1,
    },
    {
      key: "bannerImage",
      fieldType: "image",
      group: "Content",
      label: "Banner Image",
      aspectRatio: 3 / 1,
    },
  ],
  icon: <>Banner</>,
};

export default function ProfileBanner({ config }) {
  return (
    <Box>
      <ChakraImage src={config.bannerImage} alt="Profile Banner" aspectRatio={5 / 1} />
      <ChakraImage
        src={config.profileImage}
        alt="Profile"
        borderRadius="full"
        h="16"
        mt="-10"
        ml="5"
      />
    </Box>
  );
}
