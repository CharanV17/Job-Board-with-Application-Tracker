import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import {
  getApplicationById,
  updateApplicationStatus,
  getApplicationsForJob,
  getMyApplications,
  createApplication,
} from "../controllers/applications.controller";

const router = Router();

/**
 * ⚠️ IMPORTANT:
 * Static routes must come BEFORE dynamic "/:id" route.
 * Otherwise "/my" and "/job/..." are interpreted as ":id".
 */

// Candidate → list their own applications
router.get(
  "/my",
  authMiddleware,
  requireRole("candidate"),
  getMyApplications
);

// Employer → list applications for a job they posted
router.get(
  "/job/:jobId",
  authMiddleware,
  requireRole("employer"),
  getApplicationsForJob
);

// Candidate applies for a job
router.post(
  "/",
  authMiddleware,
  requireRole("candidate"),
  createApplication
);

// Employer updates status
router.put(
  "/:id/status",
  authMiddleware,
  requireRole("employer"),
  updateApplicationStatus
);

// LAST → Candidate or employer → view application by ID
router.get(
  "/:id",
  authMiddleware,
  getApplicationById
);

export default router;
