import { Router } from "express";
import { auth, requireRole } from "../middleware/auth";
import {
  createApplication,
  getApplicationById,
  updateApplicationStatus,
  getMyApplications
} from "../controllers/applications.controller";
import { uploadResume } from "../config/s3"; // 🟢 S3 uploader

const router = Router();

/**
 * Candidate → Apply for job (resume upload)
 */
router.post(
  "/",
  auth,
  requireRole("candidate"),
  uploadResume.single("resume"),   // 🟢 Upload resume to S3
  createApplication
);

/**
 * Candidate → My applications
 */
router.get("/my", auth, requireRole("candidate"), getMyApplications);

/**
 * Candidate + Employer → View application
 */
router.get("/:id", auth, getApplicationById);

/**
 * Employer → Update status
 */
router.put(
  "/:id/status",
  auth,
  requireRole("employer"),
  updateApplicationStatus
);

export default router;
