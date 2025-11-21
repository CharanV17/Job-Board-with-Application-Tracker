import { Router } from "express";
import { auth, requireRole } from "../middleware/auth";
import {
  getApplicationById,
  updateApplicationStatus
} from "../controllers/applications.controller";

const router = Router();

// Candidate + Employer can view
router.get("/:id", auth, getApplicationById);

// Only employer can update status
router.put("/:id/status", auth, requireRole("employer"), updateApplicationStatus);

export default router;
