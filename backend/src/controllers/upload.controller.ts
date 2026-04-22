  import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
  import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

  export const getPresignedUrl = async (req: any, res: any) => {
    try {
      const { filename, contentType } = req.query;

      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `resumes/${Date.now()}-${filename}`,
        ContentType: contentType,
      };

      const command = new PutObjectCommand(params);

      const uploadUrl = await getSignedUrl(new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        }
      }), command, { expiresIn: 3600 });

      const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

      return res.json({ uploadUrl, fileUrl });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to generate URL" });
    }
  };
