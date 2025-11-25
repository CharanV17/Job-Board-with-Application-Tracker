"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const applications_controller_1 = require("../controllers/applications.controller");
const s3_1 = require("../config/s3"); // 🟢 S3 uploader
const router = (0, express_1.Router)();
/**
 * Candidate → Apply for job (resume upload)
 */
router.post("/", auth_1.auth, (0, auth_1.requireRole)("candidate"), s3_1.uploadResume.single("resume"), // 🟢 Upload resume to S3
applications_controller_1.createApplication);
/**
 * Candidate → My applications
 */
router.get("/my", auth_1.auth, (0, auth_1.requireRole)("candidate"), applications_controller_1.getMyApplications);
/**
 * Candidate + Employer → View application
 */
router.get("/:id", auth_1.auth, applications_controller_1.getApplicationById);
/**
 * Employer → Update status
 */
router.put("/:id/status", auth_1.auth, (0, auth_1.requireRole)("employer"), applications_controller_1.updateApplicationStatus);
exports.default = router;
