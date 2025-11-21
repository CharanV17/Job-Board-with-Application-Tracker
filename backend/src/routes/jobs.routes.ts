import { Router } from "express";
import {
  createJob,
  listJobs,
  getJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
  getJobApplications
} from "../controllers/jobs.controller";

import { auth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createJobSchema, updateJobSchema } from "../validators/job.validators";

const router = Router();

// Create job (Employer only)
router.post(
  "/",
  auth,
  requireRole("employer"),
  validate(createJobSchema),
  createJob
);

// Public job listing
router.get("/", listJobs);

// Public job detail
router.get("/:id", getJob);

// Update job (Employer only)
router.put(
  "/:id",
  auth,
  requireRole("employer"),
  validate(updateJobSchema),
  updateJob
);

// Delete job (Employer only)
router.delete("/:id", auth, requireRole("employer"), deleteJob);

// Employer's own jobs
router.get(
  "/employer/jobs",
  auth,
  requireRole("employer"),
  getEmployerJobs
);

// Employer gets applications for a job
router.get(
  "/:id/applications",
  auth,
  requireRole("employer"),
  getJobApplications
);

export default router;
