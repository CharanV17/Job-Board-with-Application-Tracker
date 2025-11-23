import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { requireRole } from "../middleware/role";

const router = Router();

// Only employers upload job-related files
router.post(
  "/",
  authMiddleware,
  requireRole("employer"),
  (req, res) => {
    res.json({ message: "Upload OK" });
  }
);

export default router;
