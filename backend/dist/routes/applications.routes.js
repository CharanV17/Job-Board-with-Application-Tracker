"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const applications_controller_1 = require("../controllers/applications.controller");
const router = (0, express_1.Router)();
// Candidate + Employer can view
router.get("/:id", auth_1.auth, applications_controller_1.getApplicationById);
// Only employer can update status
router.put("/:id/status", auth_1.auth, (0, auth_1.requireRole)("employer"), applications_controller_1.updateApplicationStatus);
exports.default = router;
