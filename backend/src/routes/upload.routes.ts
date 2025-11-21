import { Router } from "express";
import { generatePresignedUrl } from "../controllers/upload.controller";
import { auth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { presignSchema } from "../validators/upload.validators";

const router = Router();

// Generate presigned URL for PDF only
router.get(
  "/presign",
  auth,
  requireRole("candidate"),
  validate(presignSchema),
  generatePresignedUrl
);

export default router;
