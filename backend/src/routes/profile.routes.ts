import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { auth } from "../middleware/auth";

const router = Router();

// Get current user's profile
router.get("/", auth, getProfile);

// Update current user's profile
router.put("/", auth, updateProfile);

export default router;


