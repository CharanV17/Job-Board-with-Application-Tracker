"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.withdrawApplication = exports.getMyApplications = exports.createApplication = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const application_model_1 = __importDefault(require("../models/application.model"));
const job_model_1 = __importDefault(require("../models/job.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const email_service_1 = require("../services/email.service");
const application_received_1 = require("../emails/application-received");
const application_status_update_1 = require("../emails/application-status-update");
// ---------------- APPLY TO JOB ----------------
const createApplication = async (req, res) => {
    const { jobId, resumeUrl, originalFileName, fileSize, coverLetter } = req.body;
    // 1. Check job exists
    const job = await job_model_1.default.findById(jobId);
    if (!job)
        return res.status(404).json({ message: "Job not found" });
    // 1b. Ensure candidate exists (needed for notifications)
    const candidate = await user_model_1.default.findById(req.user.id).select("name email");
    if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
    }
    // 2. Check if candidate already applied
    const exists = await application_model_1.default.findOne({
        job: jobId,
        candidate: req.user.id,
    });
    if (exists) {
        return res.status(400).json({ message: "Already applied to this job" });
    }
    // 3. Transaction: Create application + increment applicantCount
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const app = await application_model_1.default.create([
            {
                job: jobId,
                candidate: req.user.id,
                resumeUrl,
                originalFileName,
                fileSize,
                coverLetter,
            },
        ], { session });
        await job_model_1.default.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } }, { session });
        await session.commitTransaction();
        session.endSession();
        // ---------------- EMAIL EMPLOYER ----------------
        const employer = await user_model_1.default.findById(job.employer);
        if (employer?.email) {
            await (0, email_service_1.sendEmail)(employer.email, "New Job Application Received", (0, application_received_1.applicationReceivedTemplate)(candidate.name ?? "A candidate", job.title));
        }
        return res.status(201).json(app[0]);
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};
exports.createApplication = createApplication;
// ---------------- GET ALL MY APPLICATIONS (Candidate) ----------------
const getMyApplications = async (req, res) => {
    const docs = await application_model_1.default.find({ candidate: req.user.id })
        .populate("job")
        .sort("-createdAt");
    res.json(docs);
};
exports.getMyApplications = getMyApplications;
// ---------------- WITHDRAW APPLICATION (Candidate) ----------------
const withdrawApplication = async (req, res) => {
    const app = await application_model_1.default.findById(req.params.id);
    if (!app)
        return res.status(404).json({ message: "Application not found" });
    if (String(app.candidate) !== req.user.id)
        return res.status(403).json({ message: "Not allowed" });
    // Mark as rejected (or "Withdrawn" if you add that status later)
    app.status = "Rejected";
    await app.save();
    res.json({ message: "Application withdrawn" });
};
exports.withdrawApplication = withdrawApplication;
// ---------------- UPDATE APPLICATION STATUS (Employer) ----------------
const updateStatus = async (req, res) => {
    const { status } = req.body;
    // 1. Get application with populated job
    const app = await application_model_1.default.findById(req.params.id).populate("job");
    if (!app)
        return res.status(404).json({ message: "Application not found" });
    // 2. Only the employer who owns this job can update status
    if (String(app.job.employer) !== req.user.id) {
        return res.status(403).json({ message: "Not allowed" });
    }
    // 3. Maintain status history
    app.statusHistory = app.statusHistory || [];
    app.statusHistory.push({
        status: app.status,
        changedBy: req.user.id,
        at: new Date(),
    });
    // 4. Update status
    app.status = status;
    await app.save();
    // ---------------- EMAIL CANDIDATE ----------------
    const candidate = await user_model_1.default.findById(app.candidate);
    if (candidate?.email) {
        await (0, email_service_1.sendEmail)(candidate.email, "Application Status Updated", (0, application_status_update_1.applicationStatusUpdateTemplate)(candidate.name, status, app.job.title));
    }
    res.json(app);
};
exports.updateStatus = updateStatus;
