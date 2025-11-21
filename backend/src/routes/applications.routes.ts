import { Router } from "express";
import {
  createApplication,
  getMyApplications,
  withdrawApplication,
  updateStatus
} from "../controllers/applications.controller";

import { auth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createApplicationSchema } from "../validators/application.validators";

const router = Router();

// Apply to job (Candidate)
router.post(
  "/",
  auth,
  requireRole("candidate"),
  validate(createApplicationSchema),
  createApplication
);

// Candidate - view my applications
router.get(
  "/",
  auth,
  requireRole("candidate"),
  getMyApplications
);

// Candidate - withdraw application
router.put(
  "/:id/withdraw",
  auth,
  requireRole("candidate"),
  withdrawApplication
);

// Employer - update application status
router.put(
  "/:id/status",
  auth,
  requireRole("employer"),
  updateStatus
);

export default router;
