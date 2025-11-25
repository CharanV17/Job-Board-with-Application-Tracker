"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatus = exports.updateStatus = exports.getApplicationById = exports.getMyApplications = exports.createApplication = void 0;
const application_model_1 = __importDefault(require("../models/application.model"));
const job_model_1 = __importDefault(require("../models/job.model"));
const statusWorkflow_1 = require("../constants/statusWorkflow");
// =============================
// CREATE APPLICATION (Candidate)
// =============================
const createApplication = async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;
        if (!jobId)
            return res.status(400).json({ message: "Job ID required" });
        if (!req.file?.location)
            return res.status(400).json({ message: "Resume missing" });
        const job = await job_model_1.default.findById(jobId);
        if (!job)
            return res.status(404).json({ message: "Job not found" });
        const candidateId = req.user.id;
        // Prevent duplicate submissions
        const existing = await application_model_1.default.findOne({ job: jobId, candidate: candidateId });
        if (existing) {
            return res.status(400).json({ message: "You already applied to this job" });
        }
        const application = await application_model_1.default.create({
            job: jobId,
            candidate: candidateId,
            resumeUrl: req.file.location, // 🟢 URL returned by S3
            originalFileName: req.file.originalname,
            fileSize: req.file.size,
            coverLetter,
            status: "Applied",
            statusHistory: [
                {
                    status: "Applied",
                    changedBy: candidateId,
                    at: new Date(),
                },
            ],
        });
        return res.json({
            message: "Application submitted successfully",
            application,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.createApplication = createApplication;
// =============================
// GET APPLICATIONS OF LOGGED-IN CANDIDATE
// =============================
const getMyApplications = async (req, res) => {
    try {
        const candidateId = req.user.id;
        const applications = await application_model_1.default.find({ candidate: candidateId })
            .populate("job", "title location salaryMin salaryMax")
            .sort({ createdAt: -1 });
        return res.json(applications);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to load applications" });
    }
};
exports.getMyApplications = getMyApplications;
// =============================
// GET SINGLE APPLICATION
// =============================
const getApplicationById = async (req, res) => {
    try {
        const app = await application_model_1.default.findById(req.params.id)
            .populate("job")
            .populate("candidate", "name email");
        if (!app)
            return res.status(404).json({ message: "Application not found" });
        if (req.user.role === "candidate" && app.candidate._id.toString() !== req.user.id)
            return res.status(403).json({ message: "Forbidden" });
        if (req.user.role === "employer") {
            const job = await job_model_1.default.findById(app.job._id);
            if (!job || job.employer.toString() !== req.user.id)
                return res.status(403).json({ message: "Forbidden" });
        }
        return res.json(app);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getApplicationById = getApplicationById;
// =============================
// UPDATE APPLICATION STATUS (Employer only)
// =============================
const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const app = await application_model_1.default.findById(req.params.id);
        if (!app)
            return res.status(404).json({ message: "Not found" });
        const allowed = statusWorkflow_1.allowedTransitions[app.status] || [];
        if (!allowed.includes(status))
            return res.status(400).json({ message: `Invalid transition` });
        app.statusHistory.push({
            status: app.status,
            changedBy: req.user.id,
            at: new Date(),
        });
        app.status = status;
        await app.save();
        return res.json(app);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateStatus = updateStatus;
exports.updateApplicationStatus = exports.updateStatus;
