import { api } from "./api";

export const uploadService = {
  getPresignedUrl: async (filename: string, contentType: string) => {
    const res = await api.get("/uploads/presign", {
      params: { filename, contentType }
    });
    return res.data; // returns { uploadUrl, fileUrl }
  },

  uploadToS3: async (uploadUrl: string, file: File) => {
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type
      },
      body: file,
    });

    if (!res.ok) {
      console.error("S3 Upload Error:", await res.text());
      throw new Error("Failed to upload file to S3");
    }

    return true;
  }
};
