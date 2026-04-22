import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { getPresignedUrl } from "../controllers/upload.controller";

const router = Router();

router.get("/presign", authMiddleware, getPresignedUrl);

export default router;
