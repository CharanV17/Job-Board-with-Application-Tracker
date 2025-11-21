import { Request, Response } from "express";
import {
  S3Client,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

export const generatePresignedUrl = async (
  req: Request & { user?: any },
  res: Response
) => {
  const { filename, contentType } = req.query;

  if (!filename || !contentType)
    return res.status(400).json({ message: "Missing filename or contentType" });

  if (contentType !== "application/pdf") {
    return res.status(400).json({ message: "Only PDF files allowed" });
  }

  const key = `resumes/${req.user.id}/${Date.now()}_${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    ContentType: String(contentType)
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  const publicUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return res.json({
    uploadUrl,
    fileKey: key,
    publicUrl
  });
};
