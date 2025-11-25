"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobApplications = exports.getEmployerJobs = exports.deleteJob = exports.updateJob = exports.getJob = exports.listJobs = exports.createJob = void 0;
const job_model_1 = __importDefault(require("../models/job.model"));
const application_model_1 = __importDefault(require("../models/application.model"));
// ---------------- CREATE JOB ----------------
const createJob = async (req, res) => {
    const { title, description, location, salaryMin, salaryMax, tags, remote } = req.body;
    const job = await job_model_1.default.create({
        employer: req.user.id,
        title,
        description,
        location,
        salaryMin,
        salaryMax,
        tags,
        remote,
    });
    res.status(201).json(job);
};
exports.createJob = createJob;
// ---------------------------------------------------------
// JOB LIST WITH PAGINATION + SEARCH + SORT
// ---------------------------------------------------------
const listJobs = async (req, res) => {
    const { q, location, remote, page = 1, limit = 10, sort = "date", } = req.query;
    const filter = {};
    if (q)
        filter.$text = { $search: q };
    if (location)
        filter.location = location;
    if (remote !== undefined)
        filter.remote = remote === "true";
    const sortMap = {
        date: { createdAt: -1 },
        salary: { salaryMax: -1 },
        relevance: { score: { $meta: "textScore" } },
    };
    const sortOption = sortMap[sort] || sortMap.date;
    const total = await job_model_1.default.countDocuments(filter);
    const jobs = await job_model_1.default.find(filter)
        .skip((+page - 1) * +limit)
        .limit(+limit)
        .sort(sortOption)
        .select(sort === "relevance" ? { score: { $meta: "textScore" } } : {});
    return res.json({
        jobs,
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / +limit),
    });
};
exports.listJobs = listJobs;
// ---------------- GET JOB DETAILS (with hasApplied flag) ----------------
const getJob = async (req, res) => {
    const job = await job_model_1.default.findById(req.params.id);
    if (!job)
        return res.status(404).json({ message: "Job not found" });
    let hasApplied = false;
    // Only check application status if user logged in as a candidate
    if (req.user?.id && req.user?.role === "candidate") {
        const exists = await application_model_1.default.exists({
            job: job._id,
            candidate: req.user.id,
        });
        hasApplied = Boolean(exists);
    }
    return res.json({
        ...job.toObject(),
        hasApplied, // 👈 consumed by frontend for Apply button logic
    });
};
exports.getJob = getJob;
// ---------------- UPDATE JOB ----------------
const updateJob = async (req, res) => {
    const job = await job_model_1.default.findOne({ _id: req.params.id, employer: req.user.id });
    if (!job)
        return res.status(404).json({ message: "Job not found or not yours" });
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
};
exports.updateJob = updateJob;
// ---------------- DELETE JOB ----------------
const deleteJob = async (req, res) => {
    const job = await job_model_1.default.findOne({ _id: req.params.id, employer: req.user.id });
    if (!job)
        return res.status(404).json({ message: "Job not found or not yours" });
    await job.deleteOne();
    res.json({ message: "Job deleted" });
};
exports.deleteJob = deleteJob;
// ---------------- JOBS FOR EMPLOYER ----------------
const getEmployerJobs = async (req, res) => {
    const jobs = await job_model_1.default.find({ employer: req.user.id });
    // Optionally include applicant count in the response
    const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
        const count = await application_model_1.default.countDocuments({ job: job._id });
        return { ...job.toObject(), applicantCount: count };
    }));
    res.json(jobsWithCounts);
};
exports.getEmployerJobs = getEmployerJobs;
// ---------------- APPLICATIONS FOR JOB ----------------
const getJobApplications = async (req, res) => {
    const job = await job_model_1.default.findOne({ _id: req.params.id, employer: req.user.id });
    if (!job)
        return res.status(403).json({ message: "Not allowed" });
    const applications = await application_model_1.default.find({ job: job._id }).populate("candidate", "name email");
    res.json(applications);
};
exports.getJobApplications = getJobApplications;
