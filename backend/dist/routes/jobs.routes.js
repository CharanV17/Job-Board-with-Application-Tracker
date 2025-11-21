"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobs_controller_1 = require("../controllers/jobs.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const job_validators_1 = require("../validators/job.validators");
const router = (0, express_1.Router)();
// Create job (Employer only)
router.post("/", auth_1.auth, (0, auth_1.requireRole)("employer"), (0, validate_1.validate)(job_validators_1.createJobSchema), jobs_controller_1.createJob);
// Public job listing
router.get("/", jobs_controller_1.listJobs);
// Public job detail
router.get("/:id", jobs_controller_1.getJob);
// Update job (Employer only)
router.put("/:id", auth_1.auth, (0, auth_1.requireRole)("employer"), (0, validate_1.validate)(job_validators_1.updateJobSchema), jobs_controller_1.updateJob);
// Delete job (Employer only)
router.delete("/:id", auth_1.auth, (0, auth_1.requireRole)("employer"), jobs_controller_1.deleteJob);
// Employer's own jobs
router.get("/employer/jobs", auth_1.auth, (0, auth_1.requireRole)("employer"), jobs_controller_1.getEmployerJobs);
// Employer gets applications for a job
router.get("/:id/applications", auth_1.auth, (0, auth_1.requireRole)("employer"), jobs_controller_1.getJobApplications);
exports.default = router;
