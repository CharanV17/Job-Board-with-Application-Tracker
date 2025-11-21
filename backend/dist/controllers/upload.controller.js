"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePresignedUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});
const generatePresignedUrl = async (req, res) => {
    const { filename, contentType } = req.query;
    if (!filename || !contentType)
        return res.status(400).json({ message: "Missing filename or contentType" });
    if (contentType !== "application/pdf") {
        return res.status(400).json({ message: "Only PDF files allowed" });
    }
    const key = `resumes/${req.user.id}/${Date.now()}_${filename}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        ContentType: String(contentType)
    });
    const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 300 });
    const publicUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return res.json({
        uploadUrl,
        fileKey: key,
        publicUrl
    });
};
exports.generatePresignedUrl = generatePresignedUrl;
