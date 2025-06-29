import { uploadImage } from "@/services/uploadService";
import { Button, Dialog, FileUpload, Icon, Image, Portal, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { PiUpload } from "react-icons/pi";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// onClose returns image URL or null
export default function ImageUploadModal({ isOpen, onClose, aspectRatio }) {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setImage(null);
      setCrop(null);
    }
  }, [isOpen]);

  function handleUpload(event) {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function getCroppedImage() {
    if (!image) return null;

    const canvas = document.createElement("canvas");
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    const quality = 0.8;

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        quality,
      );
    });
  }

  async function handleSubmit() {
    const croppedImage = await getCroppedImage();
    if (!croppedImage) {
      return;
    }

    const imageUrl = await uploadImage({
      imageBlob: croppedImage,
      fileName: `${v4()}.jpg`,
    });

    onClose(imageUrl);
  }

  return (
    <Dialog.Root placement="center" size="md" open={isOpen}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Upload Image</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {!image ? (
                <FileUpload.Root
                  maxFiles={1}
                  accept={["image/png", "image/jpeg"]}
                  onChange={handleUpload}
                >
                  <FileUpload.HiddenInput />
                  <FileUpload.Dropzone w="full">
                    <Icon size="md" color="fg.muted">
                      <PiUpload />
                    </Icon>
                    <FileUpload.DropzoneContent>
                      <Text>Drag and drop image here to upload</Text>
                      <Text textStyle="sm" color="fg.muted">
                        .png, .jpg up to 5MB
                      </Text>
                    </FileUpload.DropzoneContent>
                  </FileUpload.Dropzone>
                </FileUpload.Root>
              ) : (
                <>
                  <ReactCrop
                    crop={crop}
                    aspect={aspectRatio}
                    onChange={(crop) => setCrop(crop)}
                    keepSelection
                    ruleOfThirds
                  >
                    <Image src={image} ref={imageRef} draggable={false} userSelect="none" />
                  </ReactCrop>
                  <Button onClick={handleSubmit}>Confirm Crop</Button>
                </>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => onClose(null)}>
                Cancel
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
