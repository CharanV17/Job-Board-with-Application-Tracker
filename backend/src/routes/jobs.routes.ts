import express from "express";
import {
  getJobs,
  getEmployerJobs,
  updateJob,
  createJob,
  getJobById ,
} from "../controllers/jobs.controller";
import { authMiddleware } from "../middleware/auth";
import { requireRole } from "../middleware/role";
const router = express.Router();

// Public: search/list jobs with filters
router.get("/", getJobs);

// Employer: create a new job
router.post(
  "/",
  authMiddleware,
  requireRole("employer"),
  createJob
);

// Employer: list own jobs
router.get(
  "/employer/my-jobs",
  authMiddleware,
  requireRole("employer"),
  getEmployerJobs
);

// Employer: update job
router.put(
  "/:id",
  authMiddleware,
  requireRole("employer"),
  updateJob
);
router.get("/:id", getJobById);
export default router;
