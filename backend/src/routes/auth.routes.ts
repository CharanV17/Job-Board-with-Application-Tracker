import express from "express";
import { register, login, me } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);

export default router;
