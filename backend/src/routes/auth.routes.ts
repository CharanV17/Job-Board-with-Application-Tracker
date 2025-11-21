import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller";
import { auth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../validators/auth.validators";

const router = Router();

// Register
router.post("/register", validate(registerSchema), register);

// Login
router.post("/login", validate(loginSchema), login);

// Current user
router.get("/me", auth, me);

export default router;
