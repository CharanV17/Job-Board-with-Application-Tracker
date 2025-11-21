"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applications_controller_1 = require("../controllers/applications.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const application_validators_1 = require("../validators/application.validators");
const router = (0, express_1.Router)();
// Apply to job (Candidate)
router.post("/", auth_1.auth, (0, auth_1.requireRole)("candidate"), (0, validate_1.validate)(application_validators_1.createApplicationSchema), applications_controller_1.createApplication);
// Candidate - view my applications
router.get("/", auth_1.auth, (0, auth_1.requireRole)("candidate"), applications_controller_1.getMyApplications);
// Candidate - withdraw application
router.put("/:id/withdraw", auth_1.auth, (0, auth_1.requireRole)("candidate"), applications_controller_1.withdrawApplication);
// Employer - update application status
router.put("/:id/status", auth_1.auth, (0, auth_1.requireRole)("employer"), applications_controller_1.updateStatus);
exports.default = router;
