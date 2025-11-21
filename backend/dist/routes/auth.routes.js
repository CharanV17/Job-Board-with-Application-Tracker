"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const auth_validators_1 = require("../validators/auth.validators");
const router = (0, express_1.Router)();
// Register
router.post("/register", (0, validate_1.validate)(auth_validators_1.registerSchema), auth_controller_1.register);
// Login
router.post("/login", (0, validate_1.validate)(auth_validators_1.loginSchema), auth_controller_1.login);
// Current user
router.get("/me", auth_1.auth, auth_controller_1.me);
exports.default = router;
