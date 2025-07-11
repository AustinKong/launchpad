import { authFetch } from "@/utils/fetchUtils";

export async function uploadImage({ imageBlob, fileName }) {
  const formData = new FormData();
  formData.append("image", imageBlob, fileName);

  const response = await authFetch("/api/uploads/image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const json = await response.json();
  return json.imageUrl;
}
