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
// ---------------- GET ALL JOBS (PUBLIC SEARCH) ----------------
const listJobs = async (req, res) => {
    const { q, location, remote, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (q)
        filter.$text = { $search: q };
    if (location)
        filter.location = location;
    if (remote !== undefined)
        filter.remote = remote === "true";
    const jobs = await job_model_1.default.find(filter)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    res.json(jobs);
};
exports.listJobs = listJobs;
// ---------------- GET JOB DETAILS ----------------
const getJob = async (req, res) => {
    const job = await job_model_1.default.findById(req.params.id);
    if (!job)
        return res.status(404).json({ message: "Job not found" });
    res.json(job);
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
    res.json(jobs);
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
